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
  Materialize.updateTextFields();
   $('select').material_select();
   $('.datepicker').pickadate({
    selectMonths: true, // Creates a dropdown to control month
    selectYears: 15, // Creates a dropdown of 15 years to control year,
    today: 'Today',
    clear: 'Clear',
    close: 'Ok',
    closeOnSelect: false // Close upon selecting a date,
  });
   $('.timepicker').pickatime({
    default: 'now', // Set default time: 'now', '1:30AM', '16:30'
    fromnow: 0,       // set default time to * milliseconds from now (using with default = 'now')
    twelvehour: false, // Use AM/PM or 24-hour format
    donetext: 'OK', // text for done-button
    cleartext: 'Clear', // text for clear-button
    canceltext: 'Cancel', // Text for cancel-button
    autoclose: false, // automatic close timepicker
    ampmclickable: true, // make AM PM clickable
    aftershow: function(){} //Function for after opening timepicker
  });
   $('input#input_text, textarea#textarea2').characterCounter();
   $('input.autocomplete2').autocomplete({
    data: {
      "Apple": null,
      "Microsoft": null,
      "Google": 'https://placehold.it/250x250'
    },
    limit: 20, // The max amount of results that can be shown at once. Default: Infinity.
    onAutocomplete: function(val) {
      // Callback function when value is autcompleted.
    },
    minLength: 1, // The minimum length of the input for the autocomplete to start. Default: 1.
  });
})
$('#textarea1').val('');
$('#textarea1').trigger('autoresize');

