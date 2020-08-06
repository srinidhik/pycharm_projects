/**
 * Created by Sanjay on 25/5/17.
 */


angular.module("cf.customizeProduct",["cf.services", "cf.directives"])
.config(["$interpolateProvider", function($interpolateProvider){
        $interpolateProvider.startSymbol('{$');
        $interpolateProvider.endSymbol('$}');
}]);

