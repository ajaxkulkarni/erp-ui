var app = angular.module("app", ["ngRoute"]);

var host = "http://localhost:8080/erp-service";
//var host = "https://115.124.124.220:8080/jobz";
var root = host + "/service";
var rootAdmin = host + "/adminService";




app.service('userService', function ($http, $q) {

    var deferred;
    var response = {};

    this.subscribe = function ($scope) {
        //alert("In service");
        var dataObj = {
            user: {
                name: $scope.user.name,
                email: $scope.user.email,
                phone: $scope.user.phone
            }
        };
        deferred = $q.defer();
        var res = $http.post(root + '/subscribeUser', dataObj);
        res.success(function (data, status, headers, config) {
            response = data;
            deferred.resolve(response);
        });
        res.error(function (data, status, headers, config) {
            /*alert("failure message: " + JSON.stringify({
                data: data
            }));*/
            response = data;
            deferred.resolve(response);
        });

        response = deferred.promise;
        return $q.when(response);
    }
    
    this.login = function ($scope) {
        //alert("In service");
        var dataObj = {
            user: {
                email: $scope.user.email,
                password: $scope.user.password
            }
        };
        deferred = $q.defer();
        var res = $http.post(root + '/loginUser', dataObj);
        res.success(function (data, status, headers, config) {
            response = data;
            deferred.resolve(response);
        });
        res.error(function (data, status, headers, config) {
            /*alert("failure message: " + JSON.stringify({
                data: data
            }));*/
            response = data;
            deferred.resolve(response);
        });

        response = deferred.promise;
        return $q.when(response);
    }
    

    this.getUser = function ($scope) {
        //alert("In service");
        var dataObj = {
            user: {
                email: $scope.user.email
            }
        };
        deferred = $q.defer();
        var res = $http.post(root + '/getUser', dataObj);
        res.success(function (data, status, headers, config) {
            response = data;
            deferred.resolve(response);
        });
        res.error(function (data, status, headers, config) {
            /*alert("failure message: " + JSON.stringify({
                data: data
            }));*/
            response = data;
            deferred.resolve(response);
        });

        response = deferred.promise;
        return $q.when(response);
    }
    
    this.addCompany = function ($scope) {
        //alert("In service");
       /* var dataObj = {
            user: {
                name: $scope.user.name,
                email: $scope.user.email,
                phone: $scope.user.phone
            }
        };*/
        deferred = $q.defer();
        var res = $http.post(root + '/addCompany', $scope.dataObj);
        res.success(function (data, status, headers, config) {
            response = data;
            deferred.resolve(response);
        });
        res.error(function (data, status, headers, config) {
            /*alert("failure message: " + JSON.stringify({
                data: data
            }));*/
            response = data;
            deferred.resolve(response);
        });

        response = deferred.promise;
        return $q.when(response);
    }
    
    this.addEmployee = function ($scope) {
        deferred = $q.defer();
        var res = $http.post(root + '/addEmployee', $scope.dataObj);
        res.success(function (data, status, headers, config) {
            response = data;
            deferred.resolve(response);
        });
        res.error(function (data, status, headers, config) {
            response = data;
            deferred.resolve(response);
        });

        response = deferred.promise;
        return $q.when(response);
    }
    
    this.getAllEmployees = function ($scope) {
        var defer = $q.defer();
        var res = $http.post(root + '/getAllEmployees', $scope.dataObj);
        res.success(function (data, status, headers, config) {
            response = data;
            defer.resolve(response);
            console.log("R:" + response.user.company.employees);
           
        });
        res.error(function (data, status, headers, config) {
            response = data;
            defer.resolve(response);
            
        });

        response = defer.promise;
        return $q.when(response);
    } 
    
    this.getAllLeaveTypes = function ($scope) {
        var defer = $q.defer();
        var res = $http.post(root + '/getAllLeaveTypes', $scope.dataObj);
        res.success(function (data, status, headers, config) {
            response = data;
            defer.resolve(response);
            //console.log("R:" + response.user.company.employees);
           
        });
        res.error(function (data, status, headers, config) {
            response = data;
            defer.resolve(response);
            
        });

        response = defer.promise;
        return $q.when(response);
    }
    
    this.applyLeave = function ($scope) {
        var deferred = $q.defer();
        var res = $http.post(root + '/applyLeave', $scope.dataObj);
        res.success(function (data, status, headers, config) {
            response = data;
            deferred.resolve(response);
        });
        res.error(function (data, status, headers, config) {
            response = data;
            deferred.resolve(response);
        });

        response = deferred.promise;
        return $q.when(response);
    }
    
    
    this.getAllEmployeeLeaves = function ($scope) {
        var defer = $q.defer();
        var res = $http.post(root + '/getAllLeaves', $scope.dataObj);
        res.success(function (data, status, headers, config) {
            response = data;
            defer.resolve(response);
            console.log("R:" + response.user.company.employees);
           
        });
        res.error(function (data, status, headers, config) {
            response = data;
            defer.resolve(response);
            
        });

        response = defer.promise;
        return $q.when(response);
    } 
    
    this.getEmployeeLeaves = function ($scope) {
        var defer = $q.defer();
        var res = $http.post(root + '/getEmployeeLeaves', $scope.dataObj);
        res.success(function (data, status, headers, config) {
            response = data;
            defer.resolve(response);
            //console.log("R:" + response.user.company.employees);
           
        });
        res.error(function (data, status, headers, config) {
            response = data;
            defer.resolve(response);
            
        });

        response = defer.promise;
        return $q.when(response);
    }
    
    
    this.callService = function ($scope, method) {
        var defer = $q.defer();
        var res = $http.post(root + method, $scope.dataObj);
        res.success(function (data, status, headers, config) {
            response = data;
            defer.resolve(response);
            //console.log("R:" + response.user.company.employees);
           
        });
        res.error(function (data, status, headers, config) {
            response = data;
            defer.resolve(response);
            
        });

        response = defer.promise;
        return $q.when(response);
    }
    
    this.logout = function () {
        
    }
    

});


app.service('adminService', function ($http, $q) {

    var deferred;
    var response = {};

    this.getAllUsers = function () {
        var dataObj = {};
        deferred = $q.defer();
        var res = $http.post(rootAdmin + '/adminGetAllUsers', dataObj);
        res.success(function (data, status, headers, config) {
            response = data;
            console.log("Success:" + data);
            deferred.resolve(response);
        });
        res.error(function (data, status, headers, config) {
            response = data;
            console.log("Error:" + data);
            deferred.resolve(response);
        });
        response = deferred.promise;
        return $q.when(response);
    }
    
    this.activateUser = function (user) {
        //alert("In service");
        var dataObj = {
            user: {
                email: user.email
            }
        };
        deferred = $q.defer();
        var res = $http.post(rootAdmin + '/activateUser', dataObj);
        res.success(function (data, status, headers, config) {
            response = data;
            deferred.resolve(response);
        });
        res.error(function (data, status, headers, config) {
            response = data;
            deferred.resolve(response);
        });

        response = deferred.promise;
        return $q.when(response);
    }

});

app.config(function($routeProvider) {
    $routeProvider
    .when("/", {
        controller:"home",
        template: " "
    })
    .when("/home", {
        templateUrl : "dashboard.html"
    })
    .when("/companyDetails", {
        templateUrl : "company_details.html",
        controller : "company"
    })
    .when("/employees", {
        templateUrl : "dashboard_employee.html",
        controller : "employee"
    })
    .when("/addEmployee", {
        templateUrl : "add_employee.html",
        controller : "employee"
    })
    .when("/viewEmployees", {
        templateUrl : "employees_details.html",
        controller : "employees"
    })
    .when("/leaves", {
        templateUrl : "dashboard_leaves.html",
        controller : "leaves"
    })
    .when("/applyLeave", {
        templateUrl : "apply_leave.html",
        controller : "leaves"
    })
    .when("/viewLeaves", {
        templateUrl : "employees_leaves.html",
        controller : "leavesData"
    })
    .when("/leaveDetails", {
        templateUrl : "employee_leaves.html",
        controller : "leaveDetails"
    })
    .when("/leavePolicy", {
        templateUrl : "leave_setting.html",
        controller : "leavePolicy"
    })
});

app.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;

            element.bind('change', function () {
                scope.$apply(function () {
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]);

