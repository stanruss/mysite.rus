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
})

