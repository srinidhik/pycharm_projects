/**
 * Created by cfit001 on 4/10/16.
 */

(function(){


    var app = angular.module('plunker', ['ngRoute']);

    app.config(function ($routeProvider) {
        $routeProvider
            .when('/main',{
                templateUrl: 'main.html',
                controller: 'MainCtrl'
            })
    });

}());

$interpolateProvider.startSymbol('[[').endSymbol(']]');

$httpProvider.defaults.xsrfCookieName = 'csrftoken';
$httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';

$resourceProvider.defaults.stripTrailingSlashes = false;
