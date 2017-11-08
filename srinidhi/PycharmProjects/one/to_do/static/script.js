function addtask() {
    var when = $('#when').val();
    var what = $('#what').val();

    var csrftoken = getCookie('csrftoken');
    setup(csrftoken);

    $.ajax({
        url: '/addtask',
        type: 'POST',
        data: {'when':when, 'what':what},
        success: function (response) {
            if(response == 'added') {
                var alertBox = '<div data-alert class="alert-box success radius"> Added</div>';
                $("#message").empty().append(alertBox).foundation().fadeOut(2000);
                setTimeout(function () {
                    location.reload();
                },1000)
            }
        }
    })
}

// ---------------------CHECKBOX------------------------

var t_ids=[];

    $('.inputclass').change(function () {

        if($(this).is(':checked')){
            var st = $(this).val();
            $('#'+st).html('').html('Completed').css('color','green');

            t_ids.push(st);

        }

        if(!$(this).is(':checked')){
            var stt = $(this).val();
            $('#'+stt).html('').html('Incomplete').css('color','red');

            var index = t_ids.indexOf(stt);
            t_ids.splice(index,1);

        }

    });

//----------------------------------------------------------

function delete_completed() {

    var csrftoken = getCookie('csrftoken');
    setup(csrftoken);

    $.ajax({
        url: '/delete_completed',
        type: 'POST',
        data: {'t_ids':t_ids},
        success:function (data) {
            location.reload();
        }
    })
    
}


function save_completed() {

    var csrftoken = getCookie('csrftoken');
    setup(csrftoken);

    $.ajax({
        url: '/save_completed',
        type: 'POST',
        data: {'t_ids':t_ids},
        success:function (data) {
            location.reload();
        }
    })
    
    
}




    function getCookie(name) {
        var cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }


    function setup(csrftoken) {
        $.ajaxSetup({
            beforeSend: function (xhr) {
                if (!this.crossDomain) {
                    xhr.setRequestHeader("X-CSRFToken", csrftoken);
                }
            }
        });
    }

