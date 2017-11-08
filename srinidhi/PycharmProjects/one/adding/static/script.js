
var app = angular.module("add", []);

app.config(function ($interpolateProvider) {
    $interpolateProvider.startSymbol('[[');
    $interpolateProvider.endSymbol(']]');
});

app.controller("AddCtrl", function ($scope, $window) {

    var input1 = 0;
    var input2 = 0;
    var input3 = 0;
    
    $scope.adding = function () {
        input1 = Number($scope.input1 || 0);
        input2 = Number($scope.input2 || 0);
        input3 = Number($scope.input3 || 0);

        $scope.output = input1 + input2 + input3;

    };
    

    $scope.count = $window.count;
    $scope.total = $window.total;
    $scope.items = $window.items;

});


function save() {
    var input1 = $('#input1').val();
    var input2 = $('#input2').val();
    var input3 = $('#input3').val();
    var output = $('#output').val();

    var csrftoken = getCookie('csrftoken');
    setup(csrftoken);

    $.ajax({
        type: 'POST',
        url: '/save',
        data: {'input1':input1, 'input2':input2, 'input3':input3, 'output':output},
        success: function (response) {
            $("#message").html(response);
            setTimeout(function () {
                location.reload();
            },1000);
        }
    })

}

function remove_item(val) {
    var remove_id = val;

    var csrftoken = getCookie('csrftoken');
    setup(csrftoken);


    $.ajax({
        type: 'POST',
        url: '/remove',
        data: {'remove_id':remove_id},
        success: function (response) {
            $("#message").html(response);
            setTimeout(function () {
                location.reload();
            },1000);
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
