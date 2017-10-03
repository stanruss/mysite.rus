<?php

class Loginza {

	function __construct(modX &$modx,array $config = array()) {
		$this->modx =& $modx;

		$corePath = $this->modx->getOption('loginza.core_path',$config,$this->modx->getOption('core_path').'components/loginza/');
		
		$this->config = array_merge(array(
			'corePath' => $corePath
			,'modelPath' => $corePath.'model/'
			,'chunksPath' => $corePath.'elements/chunks/'
			,'snippetsPath' => $corePath.'elements/snippets/'
			,'processorsPath' => $corePath.'processors/'
			
			,'rememberme' => true
			,'loginTpl' => 'tpl.Loginza.login'
			,'logoutTpl' => 'tpl.Loginza.logout'
			,'profileTpl' => 'tpl.Loginza.profile'
			,'saltName' => ''
			,'saltPass' => ''
			,'groups' => ''
			,'loginContext' => ''
			,'addContexts' => ''
			,'updateProfile' => true
			,'profileFields' => 'username,email,fullname,phone,mobilephone,dob,gender,address,country,city,state,zip,fax,photo,comment,website'
			,'requiredFields' => 'username,email,fullname'
			,'loginResourceId' => null
			,'logoutResourceId' => null
		),$config);
	}

	function Login() {
		if (strpos($_SERVER['HTTP_REFERER'], 'loginza') == false) {
			$this->modx->log(modX::LOG_LEVEL_ERROR, 'Loginza: invalid http referer');
			return $this->Refresh();
		}
		if (empty($_POST['token'])) {
			$this->modx->log(modX::LOG_LEVEL_ERROR, 'Loginza: invalid token');
			return $this->Refresh();
		}

		$url = 'http://loginza.ru/api/authinfo?token='.$_POST['token'];
		if (function_exists('curl_init')) {
			$curl = curl_init($url);
			curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
			curl_setopt($curl, CURLOPT_HEADER, false);
			curl_setopt($curl, CURLOPT_USERAGENT, 'Loginza for MODX Revolution');
			curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
			$opt = curl_exec($curl);
			curl_close($curl);
		} else {
			$opt = file_get_contents($url);
		}

		$arr = json_decode($opt, true);
		if (empty($arr['identity'])) {
			$this->modx->log(modX::LOG_LEVEL_ERROR, 'Loginza: received broken user array');
			return $this->Refresh();
		}

		$identity = $arr['identity'];
		$userkey = md5($arr['identity'].$this->config['saltName']);
		$password = md5($arr['identity'].$this->config['saltPass']);;
		$username = $this->Sanitize($arr['nickname']);
			if (empty($username)) {
				$username = $userkey;
			}
		$fullname = $arr['name']['full_name'];
			if (empty($fullname)) {
				$fullname = $arr['name']['first_name'].' '.$arr['name']['last_name'];
			}
		$provider = $arr['provider'];
		$email = $arr['email'];
		$g = $arr['gender'];
			if ($g == 'M') {$gender = 1;}
			else if ($g == 'F') {$gender = 2;}
			else {$gender = 0;}
		if (!empty($arr['dob'])) {
			list($y,$m,$d) = explode('-',$arr['dob']);
			$dob = @mktime(0,0,0, $m,$d,$y);
		}
		else {$dob = 0;}
		$photo = $arr['photo'];

		// Меняем расположение ключа для юзеров версии 1.1.*
		if ($user = $this->modx->getObject('modUser', array('username' => $userkey, 'remote_key' => null))) {
			$user->set('remote_key', $userkey);
			$user->set('username', $username);
			$user->save();
		}
		
		$newuser = 0;
		// Если юзер заходит первый раз - создаем ему учетную запись
		if (!$this->modx->getObject('modUser', array('remote_key' => $userkey))) {
			$user = $this->modx->newObject('modUser', array('remote_key' => $userkey, 'password' => $password));
			
			// Проверяем занятость имени юзера
			if ($exists = $this->modx->getCount('modUser', array('username' => $username))) {
				$user->set('username', $username.($exists +1));
			}
			else {
				$user->set('username', $username);
			}
			
			// Профиль юзера, мы его обновим чуть позже
			$userProfile = $this->modx->newObject('modUserProfile');
			$user->addOne($userProfile);

			// Если указано - заносим в группы
			if (!empty($this->config['groups'])) {
				$groups = explode(',', $this->config['groups']);

				$userGroups = array();
				foreach ($groups as $group) {
					$group = trim($group);

					if ($tmp = $this->modx->getObject('modUserGroup', array('name' => $group))) {
						$gid = $tmp->get('id');
						$userGroup = $this->modx->newObject('modUserGroupMember');
						$userGroup->set('user_group', $gid);
						$userGroup->set('role', 1);

						$userGroups[] = $userGroup;
					}
				}
				$user->addMany($userGroups);
			}

			if (!$this->config['updateProfile']) {
				$this->modx->invokeEvent('OnBeforeUserFormSave',array(
					'mode' => modSystemEvent::MODE_NEW
					,'id' => 0
					,'user' => &$user
					,'profile' => &$userProfile
				));
			}
			$user->save();
			if (!$this->config['updateProfile']) {
				$this->modx->invokeEvent('OnUserFormSave',array(
					'mode' => modSystemEvent::MODE_NEW
					,'id' => $user->get('id')
					,'user' => &$user
					,'profile' => &$userProfile
				));
			}
			$newuser = 1;
		}

		// Получаем юзера
		$user = $this->modx->getObject('modUser', array('remote_key' => $userkey));
		$username = $user->get('username');

		// Обновляем профиль юзера, усли указано его обновлять, или он только что создан.
		if ($this->config['updateProfile'] || $newuser) {
			$profile = $user->getOne('Profile');

			$profile->set('fullname', $this->Sanitize($fullname));
			$profile->set('email', strip_tags($email));
			$profile->set('dob', $dob);
			$profile->set('gender', $gender);
			$profile->set('website', strip_tags($provider));
			$profile->set('comment', strip_tags($identity));
			$profile->set('photo', $this->Sanitize($photo));
			$this->modx->invokeEvent('OnBeforeUserFormSave',array(
				'mode' => $newuser ? modSystemEvent::MODE_NEW : modSystemEvent::MODE_UPD
				,'id' => $user->get('id')
				,'user' => &$user
				,'profile' => &$profile
			));
			$profile->save();
			$this->modx->invokeEvent('OnUserFormSave',array(
				'mode' => $newuser ? modSystemEvent::MODE_NEW : modSystemEvent::MODE_UPD
				,'id' => $user->get('id')
				,'user' => &$user
				,'profile' => &$profile
			));
		}

		$data = array(
			'username' => $username,
			'password' => $password,
			'rememberme' => $this->config['rememberme']
		);
		if (!empty($this->config['loginContext'])) {$data['login_context'] = $this->config['loginContext'];}
		if (!empty($this->config['addContexts'])) {$data['add_contexts'] = $this->config['addContexts'];}

		// Логиним юзера
		$response = $this->modx->runProcessor('/security/login', $data);
		if ($response->isError()) {
			$this->modx->log(modX::LOG_LEVEL_ERROR, 'Loginza: login error. Username: '.$username.', uid: '.$user->get('id').'. Message: '.$response->getMessage());
			$_SESSION['loginza.error'] = $response->getMessage();
		}
		return $this->Refresh('login');
	}


	function Logout() {
		$response = $this->modx->runProcessor('/security/logout');
		if ($response->isError()) {
			$this->modx->log(modX::LOG_LEVEL_ERROR, 'Loginza: logout error. Username: '.$this->modx->user->get('username').', uid: '.$this->modx->user->get('id').'. Message: '.$response->getMessage());
			$_SESSION['loginza.error'] = $response->getMessage();
		}
		return $this->Refresh('logout');
	}


	function getProfile($data = array()) {
		if (!$this->modx->user->isAuthenticated()) {
			$id = $this->modx->getOption('unauthorized_page');
			if ($id != $this->modx->resource->id) {
				return $this->modx->sendForward($id);
			}
			else {
				header('HTTP/1.0 401 Unauthorized');
				return 'Loginza error: 401 Unauthorized';
			}
		}
		$user = $profile = array();
		
		if ($user = $this->modx->getObject('modUser', $this->modx->user->id)) {
			$profile = $user->getOne('Profile')->toArray();
			$user = $user->toArray();
		}
		$arr = array_merge($user, $profile, $data);
		if (empty($data['success']) && !empty($_POST)) {
			$tmp = array();
			foreach ($_POST as $k => $v) {
				$tmp[$k] = $this->Sanitize($v);
			}
			$arr = array_merge($arr, $tmp);
		}
		return $this->modx->getChunk($this->config['profileTpl'], $arr);
	}


	function updateProfile() {
		if (!$this->modx->user->isAuthenticated()) {
			return $this->Refresh();
		}

		$data = $errors = array();
		$profileFields = explode(',', $this->config['profileFields']);
		foreach ($profileFields as $field) {
			if (!empty($_POST[$field])) {$data[$field] = $this->Sanitize($_POST[$field]);}
		}
		$data['requiredFields'] = explode(',', $this->config['requiredFields']);
		
		$response = $this->runProcessor('web/user/update', $data);
		if ($response->isError()) {
			foreach ($response->errors as $error) {
				$errors['error.'.$error->field] = $error->message;
			}
			$errors['success'] = 0;
		}
		else {$errors['success'] = 1;}
		
		return $this->getProfile($errors);
	}


	function loadTpl($arr = array()) {
		$url = MODX_SITE_URL . substr($_SERVER['REQUEST_URI'], 1);
		
		if ($pos = strpos($url,'?')) {
			$url .= '&action=';
		}
		else {
			$url .= '?action=';
		}
		$error = '';
		if (!empty($_SESSION['loginza.error'])) {
			$error = $_SESSION['loginza.error'];
			unset($_SESSION['loginza.error']);
		}
		
		if ($this->modx->user->isAuthenticated()) {
			$user = $this->modx->user->toArray();
			$profile = $this->modx->user->getOne('Profile')->toArray();
			$arr = array_merge($user,$profile);
			$arr['logout_url'] = $url.'logout';
			$arr['error'] = $error;
			
			return $this->modx->getChunk($this->config['logoutTpl'], $arr);
		}
		else {
			$arr = array('login_url' => urlencode($url.'login'));
			$arr['error'] = $error;
			
			return $this->modx->getChunk($this->config['loginTpl'], $arr);
		}
	}


	function Sanitize($string = '') {
		$expr = '/[^-_a-zа-яё0-9@\s\.\,\:\/\\\]+/iu';
		return preg_replace($expr, '', $string);
	}


	function runProcessor($processor = '', $data = array()) {
		return $this->modx->runProcessor($processor, $data, array(
				'processors_path' => $this->config['processorsPath']
			)
		);
	}


	function Refresh($action = null) {
		if ($action == 'login' && $this->config['loginResourceId']) {
			$url = $this->modx->makeUrl($this->config['loginResourceId'],'','','full');
		}
		else if ($action == 'logout' && $this->config['logoutResourceId']) {
			$url = $this->modx->makeUrl($this->config['logoutResourceId'],'','','full');
		}
		else {
			$url = MODX_SITE_URL . substr($_SERVER['REQUEST_URI'],1);
			
			if ($pos = strpos($url, '?')) {
				$arr = explode('&',substr($url, $pos+1));
				$url = substr($url, 0, $pos);
				if (count($arr) > 1) {
					foreach ($arr as $k => $v) {
						if (strtolower($v) == 'action=login' || strtolower($v) == 'action=logout') {
							unset($arr[$k]);
						}
					}
					if (!empty($arr)) {
						$url = $url . '?' . implode('&', $arr);
					}
				}
			}
		}
		
		$this->modx->sendRedirect($url);
	}
}

?>
