$(function() {

	$('#my-menu').mmenu({
		extensions: [ 'widescreen', 'theme-white', 'effect-menu-slide', 'pagedim-black' ],
		navbar: {
			title: '<img src="assets/templates/Stas/app/img/logo-1.svg" alt="Салон красоты Смитлер">'
		},
		offCanvas: {
			position  : 'left'
		}
	});

	var api = $('#my-menu').data('mmenu');
	api.bind('opened', function () {
		$('.hamburger').addClass('is-active');
	}).bind('closed', function () {
		$('.hamburger').removeClass('is-active');
	});
$(".main-carousel").owlCarousel({
  	animateOut: 'fadeOut',
  	animateIn: 'fadeIn',
    nav: true,
    navText: ["<img src='../assets/templates/Stas/app/img/left.png'>","<img src='../assets/templates/Stas/app/img/right.png'>"],
    items:1,
    autoplay:true,
		autoplayTimeout:5000,
		loop:true,
    margin:0,
		autoplayHoverPause:false,
    smartSpeed:2000
  });
$('#exampleModal').on('show.bs.modal', function (event) {
  var button = $(event.relatedTarget) // Button that triggered the modal
  var recipient = button.data('whatever') // Extract info from data-* attributes
  // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
  // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
  var modal = $(this)
  modal.find('.modal-title').text('New message to ' + recipient)
  modal.find('.modal-body input').val(recipient)
});

$(window).scroll(function() {
        if ($(this).scrollTop() > 100) {
            if ($('#upbutton').is(':hidden')) {
                $('#upbutton').css({opacity : 1}).fadeIn('slow');
            }
        } else { $('#upbutton').stop(true, false).fadeOut('fast'); }
    });
    $('#upbutton').click(function() {
        $('html, body').stop().animate({scrollTop : 0}, 300);
    });
	});
(function(){
  $(window).scroll(function () {
      var top = $(document).scrollTop();
      $('.splash').css({
        'background-position': '0px -'+(top/3).toFixed(2)+'px'
      });
      if(top > 50)
        $('#home > .navbar').removeClass('navbar-transparent');
      else
        $('#home > .navbar').addClass('navbar-transparent');
  });

  $("a[href='#']").click(function(e) {
    e.preventDefault();
  });

  var $button = $("<div id='source-button' class='btn btn-success btn-md' title='Show source'> ≡≡ </div>").click(function(){
    var html = $(this).parent().html();
    html = cleanSource(html);
    $("#source-modal pre").text(html);
    $("#source-modal").modal();
  });

  $('.bs-component [data-toggle="popover"]').popover();
  $('.bs-component [data-toggle="tooltip"]').tooltip();

  $(".bs-component").hover(function(){
    $(this).append($button);
    $button.show();
  }, function(){
    $button.hide();
  });

  function cleanSource(html) {
    var lines = html.split(/\n/);

    lines.shift();
    lines.splice(-1, 1);

    var indentSize = lines[0].length - lines[0].trim().length,
        re = new RegExp(" {" + indentSize + "}");

    lines = lines.map(function(line){
      if (line.match(re)) {
        line = line.substring(indentSize);
      }

      return line;
    });

    lines = lines.join("\n");

    return lines;
  };

$(function() {
        baguetteBox.run('.gallery');
    });

})();

(function () {

    'use strict';
    $(window).on('load', function (e){
        $('#preloader').fadeOut('slow',function(){$(this).remove();});
    });
    
})(jQuery)
