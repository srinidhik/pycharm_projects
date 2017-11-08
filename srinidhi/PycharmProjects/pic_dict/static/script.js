function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
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
        beforeSend: function(xhr) {
            if (!this.crossDomain) {
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            }
        }
    });
}


function add(val) {
    var element = $('#add_form');
    
    if (val == 'add_form')
        element.show();
    else 
        element.hide();
}

function add_data() {
    var letter = $('#letter').val();
    var word = $('#word').val();
    var photo = $('#photo');




    var csrftoken = getCookie('csrftoken');
    setup(csrftoken);
    
    $.ajax({
        type: 'POST',
        url: '/add_data',
        data: {'letter':letter, 'word':word, 'photo':photo},
        success: function (response) {
            $('#add_form').html(response);
            setTimeout(function () {
                location.reload();
            }, 2000);
        }
    })
}


function input(val) {
    var letter = val;
    
    var csrftoken = getCookie('csrftoken');
    setup(csrftoken);
    
    $.ajax({
        type: 'POST',
        url: '/word',
        data: {'letter':letter},
        success: function (response) {
            $('#reveal_word').html(response);
            setTimeout(function () {
                location.reload();
            }, 5000);
        }
    })
    
}