angular.module('curtainsApp', ['curtainsController', 'curtainsDirective', 'curtainsFactory', 'curtainsMultiselect', 'infinite-scroll', 'hl.sticky', 'ui.router'])

    .config(['$interpolateProvider', function ($interpolateProvider) {
        $interpolateProvider.startSymbol('{$');
        $interpolateProvider.endSymbol('$}');
    }])
    .config(['$httpProvider', function ($httpProvider) {
        $httpProvider.defaults.xsrfCookieName = 'csrftoken';
        $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
        $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=utf-8';
    }])
    .filter('rangeValues', function () {
        return function (rangeValuesList, minValue, maxValue) {
            minValue = parseInt(minValue);
            maxValue = parseInt(maxValue);
            for (var i = minValue; i <= maxValue; i++) {
                rangeValuesList.push(i.toString());
            }
            return rangeValuesList;
        }
    })
    .filter('convertToHTTPS', function () {
        return function (url) {
            if (url) {
                if (url.indexOf('https') > -1) {
                    return url;
                }
                return url.replace('http', 'https');
            }
        }
    })
    .config(["$stateProvider", "$urlRouterProvider", function ($stateProvider, $urlRouterProvider) {

        $stateProvider.state({
            name: 'styles',
            url: '/',
            templateUrl: 'curtainsTypes.html'
        });

        $stateProvider.state({
            name: 'fabric',
            url: '/fabric?productName',
            templateUrl: 'allCurtains.html',
            controller: 'fabricController'
        });

        $stateProvider.state({
            name: 'search',
            url: '/search?productName&skuid',
            templateUrl: 'allCurtains.html',
            controller: 'searchController'
        });

        $stateProvider.state({
            name: 'dimensions',
            url: '/dimensions?skuid&productName&type',
            templateUrl: 'dimensionPage.html',
            controller: 'dimensionsController'
        });

        $stateProvider.state({
            name: 'lining',
            url: '/lining?skuid&productName&type',
            templateUrl: 'liningPage.html',
            controller: 'liningController'
        });

        $stateProvider.state({
            name: 'mount',
            url: '/mount?skuid&productName&type',
            templateUrl: 'mountPage.html',
            controller: 'mountController'
        });

        $stateProvider.state({
            name: 'lift',
            url: '/lift?skuid&productName&type',
            templateUrl: 'liftPage.html',
            controller: 'liftController'
        });

        $stateProvider.state({
            name: 'hardware',
            url: '/hardware?skuid&productName&type',
            templateUrl: 'hardwarePage.html',
            controller: 'hardwareController'
        });

        $stateProvider.state({
            name: 'cart',
            url: '/cart?skuid&productName&type',
            templateUrl: 'cartPage.html',
            controller: 'cartController'
        });

        $stateProvider.state({
            name: 'deliveredSamples',
            url: '/deliveredSamples?productName&type&skuid',
            templateUrl: 'deliveredSamples.html',
            controller: 'deliveredSamplesController'
        });

        $urlRouterProvider.otherwise('/');

    }]);

