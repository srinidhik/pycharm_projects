/**
 * Created by cfit009 on 24/5/17.
 */

var cfServices = angular.module("cf.services",[]);
//cfServices.config(["$httpProvider", function($httpProvider){
//    $httpProvider.defaults.xsrfCookieName = 'csrftoken';
//    $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
//}]);

cfServices.config(["$httpProvider", function($httpProvider){
    //$httpProvider.defaults.xsrfCookieName = 'csrftoken';
    //$httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
    var csrfToken =  kustome.getCookie('csrftoken');
    $httpProvider.defaults.headers.common['X-CSRFToken'] = csrfToken;
}]);

cfServices.factory('Employee',['$http', function($http) {
    function Employee(employeeData) {
        if (employeeData) {
            this.setData(employeeData);
        }
        // Some other initializations related to book
    }
    Employee.prototype = {
        setData: function(employeeData){
            angular.extend(this, employeeData);
        }
    };
    return Employee;
}]);



cfServices.factory("employeeData", [function(){
    var employee = new window.employeeData.Employee(window.employeeData);
    var employeeData = {
        item : {
            employee: employee,
            options: employee.options
        }

    };
    return employeeData;
}]);
