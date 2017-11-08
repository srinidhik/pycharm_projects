
$(document).ready(function () {


    var maxlen = 20;
    var what = $('#what');
    var status = $('#status');

    status.text('maximum length is ' + maxlen);

    what.keydown(function () {

        var textlen = $(this).val().length;

        status.text((maxlen - textlen) + ' characters left..');

        if(maxlen <= textlen){
            status.css('color', 'red');
        }
        else{
            status.css('color', 'green');
        }

    })

});


