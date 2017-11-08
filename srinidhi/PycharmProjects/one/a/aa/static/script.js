

var m = angular.module('app', []);

var ctrl = function ($scope) {
    $scope.msg = "hello";
};

m.controller('ctrl', ctrl);
