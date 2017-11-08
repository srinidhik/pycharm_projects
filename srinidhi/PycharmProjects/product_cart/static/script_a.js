

var app = angular.module('cart', ['ngRoute'])
    .config(function ($routeProvider) {
        $routeProvider
            .when("/product", {
                templateUrl: "templates/select_a.html",
                controller: "productController"
            })
            .when("/view", {
                templateUrl: "templates/display_a.html",
                controller: "productController"
            })
            .otherwise({
                // template: "<h1>hello..</h1>"
                redirectTo: "/"
            })
    })
    .controller("productController", function ($scope, $window) {
        $scope.cart_count = $window.cart_count;
        $scope.data1 = $window.data1;
        $scope.complete_data = $window.complete_data;
        $scope.total = $window.total;
        $scope.rowLimit = 3;
        $scope.name = $window.name;
        $scope.rate = $window.rate;

        var names = [
            {k:'q', v:'2'},
            {k:'w', v:'1'},
            {k:'e', v:'4'},
            {k:'r', v:'6'},
            {k:'t', v:'3'},
            {k:'y', v:'9'}
        ];

        $scope.names = names;
        $scope.sortby = false;
        
        $scope.color = 'lightblue';
        
    })
    .controller("country", function () {
        this.name = 'India'
    })
    .controller("state", function () {
        this.name = 'TS'
    })
    .controller("city", function ($scope) {
        this.name = 'Hyderabad'
    });



app.config(function($interpolateProvider) {
    $interpolateProvider.startSymbol('[[');
    $interpolateProvider.endSymbol(']]');
});

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
        beforeSend: function(xhr) {
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
        url: '/place_order_a',
        data: {'product':product},
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
        data: {'product_name':product_name, 'product_rate':product_rate, 'quantity':quantity},
        success: function (response) {
            $('#message').html(response);
            setTimeout(function () {
                location.reload();
            },3000);
        }

    })


}


