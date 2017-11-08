var app = angular.module('filterApp', []);

app.controller('numbersCtrl', function ($scope){
    $scope.numbers = [];

    for (var i = 0; i < 100; i++) {
        var random = Math.floor(Math.random() * 100);
        if(random % 2 == 0) {
            $scope.numbers.push({id: i, value: random});
        }    
    }


    
});







app.config(function($interpolateProvider) {
 $interpolateProvider.startSymbol('[[');
 $interpolateProvider.endSymbol(']]');
});


