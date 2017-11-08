
global_var = null;
first_num = null;
second_num = null;
symbol = null;
answer = null;

function input0(val) {
    var element = $('#num0').val();
    global_var = (global_var*10) + element;
    $('#screen').html(global_var);
}

function input1(val) {
    var element = $('#num1').val();
    global_var = (global_var*10) + element;
    $('#screen').html(global_var);
}

function input2(val) {
    var element = $('#num2').val();
    global_var = (global_var*10) + element;
    $('#screen').html(global_var);
}

function input3(val) {
    var element = $('#num3').val();
    global_var = (global_var*10) + element;
    $('#screen').html(global_var);
}

function input4(val) {
    var element = $('#num4').val();
    global_var = (global_var*10) + element;
    $('#screen').html(global_var);
}

function input5(val) {
    var element = $('#num5').val();
    global_var = (global_var*10) + element;
    $('#screen').html(global_var);
}

function input6(val) {
    var element = $('#num6').val();
    global_var = (global_var*10) + element;
    $('#screen').html(global_var);
}

function input7(val) {
    var element = $('#num7').val();
    global_var = (global_var*10) + element;
    $('#screen').html(global_var);
}

function input8(val) {
    var element = $('#num8').val();
    global_var = (global_var*10) + element;
    $('#screen').html(global_var);
}

function input9(val) {
    var element = $('#num9').val();
    global_var = (global_var*10) + element;
    $('#screen').html(global_var);
}

function plus(val) {
    var element = $('#plus').val();
    symbol = element;
    first_num = global_var;
    global_var = null;
    element = first_num + '+' ;
    $('#screen').html(element);
}

function minus(val) {
    var element = $('#minus').val();
    symbol = element;
    first_num = global_var;
    global_var = null;
    element = first_num + '-' ;
    $('#screen').html(element);
}

function multiply(val) {
    var element = $('#multiply').val();
    symbol = element;
    first_num = global_var;
    global_var = null;
    element = first_num + '*' ;
    $('#screen').html(element);
}

function divide(val) {
    var element = $('#divide').val();
    symbol = element;
    first_num = global_var;
    global_var = null;
    element = first_num + '/' ;
    $('#screen').html(element);
}

function modulus(val) {
    var element = $('#modulus').val();
    symbol = element;
    first_num = global_var;
    global_var = null;
    element = first_num + '%' ;
    $('#screen').html(element);
}




function equals() {
    second_num = global_var;
    if (symbol == 11) {
        answer = first_num + second_num;

    }
    else if(symbol == 12){
        answer = first_num - second_num;
    }

    else if(symbol == 13){
        answer = first_num * second_num;
    }

    else if(symbol == 14){
        answer = first_num / second_num;
    }

    else if(symbol == 15){
        answer = first_num % second_num;
    }

    $('#screen').html(answer);
}

function save() {
    var first = first_num;
    var second = second_num;
    var result = answer;
    var sign = symbol;
    first_num = null;
    second_num = null;
    answer = null;
    symbol = null;
    
    var csrftoken = getCookie('csrftoken');
    setup(csrftoken);

    $.ajax({
        type: 'POST',
        url: "/save",
        data: {
            'first': first, 'second': second, 'result': result, 'symbol': sign
        },
        success: function (response) {
            if(response == 'Saved') {
                var alertBox = '<div data-alert class="alert-box success radius"> Saved</div>';
                $("#message").empty().append(alertBox).foundation().fadeOut(5000);
            }
            else  {
                var alertBox = '<div data-alert class="alert-box success radius"> Not Saved</div>';
                $("#message").empty().append(alertBox).foundation().fadeOut(5000);
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
                $("#message").empty().append(alertBox).foundation().fadeOut(5000);
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























