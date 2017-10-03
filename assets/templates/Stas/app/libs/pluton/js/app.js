'use strict';

/*
 * A Design by GraphBerry
 * Author: GraphBerry
 * Author URL: http://graphberry.com
 * License: http://graphberry.com/pages/license
 */
 




 jQuery(document).ready(function ($) {

    var lastId,
    topMenu = $("#top-navigation"),
    topMenuHeight = topMenu.outerHeight(),
        // All list items
        menuItems = topMenu.find("a"),
        // Anchors corresponding to menu items
        scrollItems = menuItems.map(function () {
            var href = $(this).attr("href");
            if(href.indexOf("#") === 0){
                var item = $($(this).attr("href"));
                if (item.length) {
                    return item;
                }
            }

        });
$(document).ready(function() {

    $(".triangle").animated("fadeInDown", "fadeOutUp");

});
   

    //Initialize header slider.
    $('#da-slider').cslider();

    //Initial mixitup, used for animated filtering portgolio.
    $('#portfolio-grid').mixitup({
        'onMixStart': function (config) {
            $('div.toggleDiv').hide();
        }
    });

    //Initial Out clients slider in client section
    $('#clint-slider').bxSlider({
        pager: false,
        minSlides: 1,
        maxSlides: 5,
        moveSlides: 2,
        slideWidth: 210,
        slideMargin: 25,
        prevSelector: $('#client-prev'),
        nextSelector: $('#client-next'),
        prevText: '<i class="icon-left-open"></i>',
        nextText: '<i class="icon-right-open"></i>'
    });


    $('input, textarea').placeholder();



        

    /*
    Function for scroliing to top
    ************************************/
    $('.scrollup').click(function () {
        $("html, body").animate({
            scrollTop: 0
        }, 600);
        return false;
    });



    /*
    Sand newsletter
    **********************************************************************/
    $('#subscribe').click(function () {
        var error = false;
        var emailCompare = /^([a-z0-9_.-]+)@([0-9a-z.-]+).([a-z.]{2,6})$/; // Syntax to compare against input
        var email = $('input#nlmail').val().toLowerCase(); // get the value of the input field
        if (email == "" || email == " " || !emailCompare.test(email)) {
            $('#err-subscribe').show(500);
            $('#err-subscribe').delay(4000);
            $('#err-subscribe').animate({
                height: 'toggle'
            }, 500, function () {
                // Animation complete.
            });
            error = true; // change the error state to true
        }

        if (error === false) {
            $.ajax({
                type: 'POST',
                url: 'php/newsletter.php',

                data: {
                    email: $('#nlmail').val()
                },
                error: function (request, error) {
                    alert("An error occurred");
                },
                success: function (response) {
                    if (response == 'OK') {
                        $('#success-subscribe').show();
                        $('#nlmail').val('')
                    } else {
                        alert("An error occurred");
                    }
                }
            });
        }

        return false;
    });

    /*
Sand mail
**********************************************************************/
$("#send-mail").click(function () {

        var name = $('input#name').val(); // get the value of the input field
        var error = false;
        if (name == "" || name == " ") {
            $('#err-name').show(500);
            $('#err-name').delay(4000);
            $('#err-name').animate({
                height: 'toggle'
            }, 500, function () {
                // Animation complete.
            });
            error = true; // change the error state to true
        }

        var emailCompare = /^([a-z0-9_.-]+)@([da-z.-]+).([a-z.]{2,6})$/; // Syntax to compare against input
        var email = $('input#email').val().toLowerCase(); // get the value of the input field
        if (email == "" || email == " " || !emailCompare.test(email)) {
            $('#err-email').show(500);
            $('#err-email').delay(4000);
            $('#err-email').animate({
                height: 'toggle'
            }, 500, function () {
                // Animation complete.
            });
            error = true; // change the error state to true
        }


        var comment = $('textarea#comment').val(); // get the value of the input field
        if (comment == "" || comment == " ") {
            $('#err-comment').show(500);
            $('#err-comment').delay(4000);
            $('#err-comment').animate({
                height: 'toggle'
            }, 500, function () {
                // Animation complete.
            });
            error = true; // change the error state to true
        }

        if (error == false) {
            var dataString = $('#contact-form').serialize(); // Collect data from form
            $.ajax({
                type: "POST",
                url: $('#contact-form').attr('action'),
                data: dataString,
                timeout: 6000,
                error: function (request, error) {

                },
                success: function (response) {
                    response = $.parseJSON(response);
                    if (response.success) {
                        $('#successSend').show();
                        $("#name").val('');
                        $("#email").val('');
                        $("#comment").val('');
                    } else {
                        $('#errorSend').show();
                    }
                }
            });
            return false;
        }

        return false; // stops user browser being directed to the php file
    });



    //Function for show or hide portfolio desctiption.
    $.fn.showHide = function (options) {
        var defaults = {
            speed: 1000,
            easing: '',
            changeText: 0,
            showText: 'Show',
            hideText: 'Hide'
        };
        var options = $.extend(defaults, options);
        $(this).click(function () {
            $('.toggleDiv').slideUp(options.speed, options.easing);
            var toggleClick = $(this);
            var toggleDiv = $(this).attr('rel');
            $(toggleDiv).slideToggle(options.speed, options.easing, function () {
                if (options.changeText == 1) {
                    $(toggleDiv).is(":visible") ? toggleClick.text(options.hideText) : toggleClick.text(options.showText);
                }
            });
            return false;
        });
    };

    //Initial Show/Hide portfolio element.
    $('div.toggleDiv').hide();
    $('.show_hide').showHide({
        speed: 500,
        changeText: 0,
        showText: 'View',
        hideText: 'Close'
    });

    /************************
    Animate elements
    *************************/
    
    //Animate thumbnails 
    jQuery('.thumbnail').one('inview', function (event, visible) {
        if (visible == true) {
            jQuery(this).addClass("animated fadeInDown");
        } else {
            jQuery(this).removeClass("animated fadeInDown");
        }
    });

    
    
    //animate first team member
    jQuery('#first-person').bind('inview', function (event, visible) {
        if (visible == true) {
            jQuery('#first-person').addClass("animated pulse");
        } else {
            jQuery('#first-person').removeClass("animated pulse");
        }
    });
    
    //animate sectond team member
    jQuery('#second-person').bind('inview', function (event, visible) {
        if (visible == true) {
            jQuery('#second-person').addClass("animated pulse");
        } else {
            jQuery('#second-person').removeClass("animated pulse");
        }
    });

    //animate thrid team member
    jQuery('#third-person').bind('inview', function (event, visible) {
        if (visible == true) {
            jQuery('#third-person').addClass("animated pulse");
        } else {
            jQuery('#third-person').removeClass("animated pulse");
        }
    });
    
    //Animate price columns
    jQuery('.price-column, .testimonial').bind('inview', function (event, visible) {
        if (visible == true) {
            jQuery(this).addClass("animated fadeInDown");
        } else {
            jQuery(this).removeClass("animated fadeInDown");
        }
    });
    
    //Animate contact form
    jQuery('.contact-form').bind('inview', function (event, visible) {
        if (visible == true) {
            jQuery('.contact-form').addClass("animated bounceIn");
        } else {
            jQuery('.contact-form').removeClass("animated bounceIn");
        }
    });

    //Animate skill bars
    jQuery('.skills > li > span').one('inview', function (event, visible) {
        if (visible == true) {
            jQuery(this).each(function () {
                jQuery(this).animate({
                    width: jQuery(this).attr('data-width')
                }, 3000);
            });
        }
    });
});

//Initialize google map for contact setion with your location.

function initializeMap() {

    var lat = '44.8164056'; //Set your latitude.
    var lon = '20.46090424'; //Set your longitude.

    var centerLon = lon - 0.0105;

    var myOptions = {
        scrollwheel: false,
        draggable: false,
        disableDefaultUI: true,
        center: new google.maps.LatLng(lat, centerLon),
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    //Bind map to elemet with id map-canvas
    var map = new google.maps.Map(document.getElementById('map-canvas'), myOptions);
    var marker = new google.maps.Marker({
        map: map,
        position: new google.maps.LatLng(lat, lon),

    });

    var infowindow = new google.maps.InfoWindow({
        content: "Your content goes here!"
    });

    google.maps.event.addListener(marker, 'click', function () {
        infowindow.open(map, marker);
    });

    infowindow.open(map, marker);
}
