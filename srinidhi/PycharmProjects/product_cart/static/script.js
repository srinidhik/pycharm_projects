

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

    function product_select() {
        var product = $('#product').val();

        var csrftoken = getCookie('csrftoken');
        setup(csrftoken);

        $.ajax({
            type: 'POST',
            url: '/place_order',
            data: {'product': product},
            success: function (response) {
                $('#ordered').html(response)
            }
        })

    }


    function place_order() {
        var product_name = $('#product_name').val();
        var product_rate = $('#product_rate').val();
        var quantity = $('#quantity').val();

        var csrftoken = getCookie('csrftoken');
        setup(csrftoken);

        $.ajax({
            type: 'POST',
            url: '/ordered',
            data: {'product_name': product_name, 'product_rate': product_rate, 'quantity': quantity},
            success: function (response) {
                $('#message').html(response);
                setTimeout(function () {
                    location.reload();
                }, 3000);
            }

        })


    }


    function placeorder(val) {

        var product_name = $('#name' + '.' + val).val();
        var product_rate = $('#rate' + '.' + val).val();
        var quantity = $('#quantity' + '.' + val).val();

        var csrftoken = getCookie('csrftoken');
        setup(csrftoken);

        $.ajax({
            type: 'POST',
            url: '/ordered',
            data: {'product_name': product_name, 'product_rate': product_rate, 'quantity': quantity},
            success: function (response) {
                $('#message').html(response);
                setTimeout(function () {
                    location.reload();
                }, 3000);
            }

        })


    }


