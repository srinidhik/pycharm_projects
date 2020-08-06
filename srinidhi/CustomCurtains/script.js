/**
 * Created by cfit006 on 22/3/18.
 */



$(document).ready(function(){
    $(document).on('click', '#scrollToTypes', function (event) {
        event.preventDefault();
        $('html, body').animate({
            scrollTop: $("#curtainTypes").offset().top - 100
        }, 'slow');
    });

    $(document).on('click', '#scrollToDeliveredSampleDiv', function (event) {
        event.preventDefault();
        $('html, body').animate({
            scrollTop: $("#deliveredSampleDiv").offset().top - 100
        }, 'slow');
    });

    $(document).on('click', '#scrollToSelectedHardwareMobile', function (event) {
        event.preventDefault();
        $('html, body').animate({
            scrollTop: $("#selectedHardwareMobile").offset().top - 100
        }, 'slow');
    });

    $(document).on('click', '.curtains-header-menu', function () {
        $(this).siblings(".curtains-header-sub-menu").toggleClass('hidden');
        $(this).find(".mobile-header").toggleClass('mobile-header-up-arrow');
    });

});
