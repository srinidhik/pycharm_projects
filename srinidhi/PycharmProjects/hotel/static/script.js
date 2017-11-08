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


function add_hotel(val) {
    var element = $('#new');
    if (val == "other") {
        $('#loginModal').foundation('reveal', 'open');
        element.show();
    }
    else
        element.hide();
}

function hotel() {
    //var name = val;
    var name = $('#hotel_name').val();
    var new_name = $('#new_hotel').val();
    var new_rent = $('#new_amount').val();

    var csrftoken = getCookie('csrftoken');
    setup(csrftoken);

    $.ajax({
        type: 'POST',
        url: '/details_html',
        data: {'name': name, 'new_name': new_name, 'new_rent': new_rent},
        success:function (data) {
            if(new_name) {
                $('#loginModal').foundation('reveal', 'close');
            }
            if(data == 'hotel_result'){
                $('#hotel_result').html(data);
            }
            $('#message').html(data).slideDown(5000);

        }

    })
}

function booked() {
    
        var rent = $('#rent').val();
        var from_date = $('#from_date').val();
        var to_date = $('#to_date').val();
        var persons = $('#persons').val();
        var hotel_info = $('#hotel_info').val();

        var csrftoken = getCookie('csrftoken');
        setup(csrftoken);

        $.ajax({
            type: 'POST',
            url: '/booked',
            data: {'rent': rent, 'from_date': from_date, 'to_date': to_date, 'persons': persons, 'hotel_info': hotel_info},
            success: function (data) {
                $('#amountdiv').html(data);
                setTimeout(location.reload(),5000);
            }
        })
    }

function loggedin() {
    var username = $("#username").val();
    var password = $("#password").val();
    
    var csrftoken = getCookie('csrftoken');     
    setup(csrftoken);
    
    $.ajax({
        type: 'POST',
        url: '/register',
        data: {'username':username, 'password': password},
        success: function (data) {
            $("#loginModal").html(data);
        }
    })

}

function accountHolder() {
    var username = $("#username").val();
    var password = $("#password").val();

    var csrftoken = getCookie('csrftoken');
    setup(csrftoken);

    $.ajax({
        type: 'POST',
        url: '/login_user',
        data: {'username':username, 'password': password},
        success: function (data) {
            if(data == 'Existing'){
                $('#new').foundation('reveal', 'open');
            }
            else{
                $('#new').html(data);
            }
        }
    })
}