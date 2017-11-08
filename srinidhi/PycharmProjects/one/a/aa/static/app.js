/**
 * Created by cfit001 on 4/10/16.
 */

(function(){


    var app = angular.module('plunker', ['ngRoute']);

    app.config(function ($routeProvider) {
        $routeProvider
            .when('/main',{
                templateUrl: 'main.html',
                contrller: 'MainCtrl'
            })
    });

}());
