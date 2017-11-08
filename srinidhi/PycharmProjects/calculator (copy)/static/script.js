
answer = null;
input_expression = null;

var display = document.getElementById('screen');

function input(val) {
    display.value += val;
}

function equals() {

    input_expression = display.value;
    answer = eval(input_expression);
    display.value = answer;

}

function save() {
    var input = input_expression;
    var result = answer;
    
    var csrftoken = getCookie('csrftoken');
    setup(csrftoken);

    $.ajax({
        type: 'POST',
        url: "/save",
        data: {
            'input': input, 'result': result
        },
        success: function (response) {
            if(response == 'Saved') {
                var alertBox = '<div data-alert class="alert-box success radius"> Saved</div>';
                $("#message").empty().append(alertBox);
            }
            else  {
                var alertBox = '<div data-alert class="alert-box success radius"> Not Saved</div>';
                $("#message").empty().append(alertBox);
            }
        }
    })
}

function clear_data() {
    var csrftoken = getCookie('csrftoken');
    setup(csrftoken);

    $.ajax({
        type: 'POST',
        url: "/clear_data",
        data: {},
        success: function (response) {
            if(response == 'Cleared') {
                var alertBox = '<div data-alert class="alert-box success radius"> Cleared</div>';
                $("#message").empty().append(alertBox);
            }
        }
    })
}

function clear_screen() {
    var csrftoken = getCookie('csrftoken');
    setup(csrftoken);

    $.ajax({
        type: 'POST',
        success: function () {
            location.reload();
        }
    });

}

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























