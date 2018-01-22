$( document ).ready(function(){
	 $(".button-collapse").sideNav();
	 $('.carousel').carousel({
	 	fullWidth:true,
	 	indicators:true,
	 	noWrap:true
	 });
	  $('.parallax').parallax();
	  $('.modal').modal({
	  	dismissible:false,
	  	opacity:.9,
	  	inDuration:400,
	  	outDuration:400,
	  	startingTop:'50%',
	  });
	$('.fixed-action-btn').openFAB();
  $('.fixed-action-btn').closeFAB();
  $('.fixed-action-btn.toolbar').openToolbar();
  $('.fixed-action-btn.toolbar').closeToolbar();
  $('.chips').material_chip();
  $('.chips-initial').material_chip({
    data: [{
      tag: 'Apple',
    }, {
      tag: 'Microsoft',
    }, {
      tag: 'Google',
    }],
  });
  $('.chips-placeholder').material_chip({
    placeholder: 'Enter a tag',
    secondaryPlaceholder: '+Tag',
  });
  $('.chips-autocomplete').material_chip({
    autocompleteOptions: {
      data: {
        'Apple': null,
        'Microsoft': null,
        'Google': null
      },
      limit: Infinity,
      minLength: 1
    }
  });
})

