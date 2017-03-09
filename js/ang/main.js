var app = angular.module("app", ["ngRoute","720kb.datepicker"]);

//var host = "http://localhost:8080/erp-service";
var host = "http://35.167.123.68:8080/erp";
var root = host + "/service";
var rootAdmin = host + "/adminService";




app.service('userService', function ($http, $q) {

    var response = {};

    this.showResponse = function ($scope,successMsg,successLink) {
        $scope.showProgress = false;
        if ($scope.response == null) {
            $scope.response = {};
            $scope.response.status = -111;
            $scope.response.responseText = "Error connecting server ..";
            $("#errorModal").modal('show');
            return;
        }
        console.log("Response :" + $scope.response.status + " msg:" + successMsg);
        //$scope.response.status = response.status;
        if ($scope.response.status == 200) {
            if(successMsg == "") {
                return;
            }
            /*if(successLink!= null && successLink != "") {
                $scope.successLink = successLink;
            } else {
                $scope.successLink = "#main";
            }*/
            //localStorage.erpEmployee = null;
            $scope.successMsg = successMsg;
            console.log("Response Text:" + $scope.response.responseText);
            $("#successModal").show();
            $("#successModal").modal('show');
            //console.log("Response :" + $scope.response.reseponseText);
        }  else {
            $("#errorModal").modal('show');
        }
        //console.log("Response :" + $scope.response.reseponseText);
    }
    
    this.showLoading = function($scope) {
        console.log("Showing loader..");
        $scope.showProgress = true;
        console.log("Loaded loader..");
    }
    
    this.initLoader = function($scope) {
        $scope.showProgress = false;
        console.log("Hiding loader..");
        
    }
    
    this.validationError = function($scope, msg) {
        $scope.errorText = msg;
        $("#warningModal").modal('show');
    }
    
    this.close = function(url) {
        $("#successModal").modal('hide');
        if(url != null && url != "") {
            window.location.href = url;
        }
    }

    this.callService = function ($scope, method) {
        var defer = $q.defer();
        var res = $http.post(root + method, $scope.dataObj);
        res.success(function (data, status, headers, config) {
            response = data;
            defer.resolve(response);
            //console.log("Result :" + JSON.stringify(data) + ":" + JSON.stringify(headers))
           

        });
        res.error(function (data, status, headers, config) {
            response = data;
            defer.resolve(response);
            console.log("Error :" + status + ":" + JSON.stringify(data) + ":" + JSON.stringify(headers))
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

app.config(function ($routeProvider) {
    $routeProvider
        .when("/", {
            controller: "home",
            templateUrl: "response.html"
        })
        .when("/main", {
            controller: "home",
            templateUrl: "response.html"
        })
        .when("/home", {
            templateUrl: "dashboard.html"
        })
        .when("/companyDetails", {
            templateUrl: "company_details.html",
            controller: "company"
        })
        .when("/employees", {
            templateUrl: "dashboard_employee.html",
            controller: "employee"
        })
        .when("/addEmployee", {
            templateUrl: "add_employee.html",
            controller: "employee"
        })
        .when("/viewEmployee", {
            templateUrl: "view_employee_data.html",
            controller: "employee"
        })
        .when("/viewEmployees", {
            templateUrl: "employees_details.html",
            controller: "employees"
        })
        .when("/leaves", {
            templateUrl: "dashboard_leaves.html",
            controller: "leaves"
        })
        .when("/applyLeave", {
            templateUrl: "apply_leave.html",
            controller: "leaves"
        })
        .when("/viewLeaves", {
            templateUrl: "employees_leaves.html",
            controller: "leavesData"
        })
        .when("/leaveDetails", {
            templateUrl: "employee_leaves.html",
            controller: "leaveDetails"
        })
        .when("/leavePolicy", {
            templateUrl: "leave_setting.html",
            controller: "leavePolicy"
        })
        .when("/changePassword", {
            templateUrl: "password_reset.html",
            controller: "profile"
        })
        .when("/salary", {
            templateUrl: "dashboard_salary.html",
            controller: "salary"
        })
        .when("/salaryStructure", {
            templateUrl: "salary_structure_dropdown.html",
            controller: "salaryStructure"
        })
        .when("/employeeSalary", {
            templateUrl: "employee_salary.html",
            controller: "employeeSalary"
        })
        .when("/employeeSalarySlips", {
            templateUrl: "view_employees_salary.html",
            controller: "employeeSalarySlips"
        })
        .when("/employeeSalarySlip", {
            templateUrl: "view_employee_salary.html",
            controller: "employeeSalarySlip"
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

app.directive('focusMe', function($timeout) {
        return {
          scope: { trigger: '@focusMe' },
          link: function(scope, element) {
            scope.$watch('trigger', function(value) {
              //alert(value);
              if(value === "true") {
                $timeout(function() {
                  element[0].focus();
                });
              }
            });
          }
        };
      });
 

/*app.directive('form1', function () {
    return {
        restrict: 'A',
        link: function (scope, elem) {

            // set up event handler on the form element
            elem.on('submit', function () {

                // find the first invalid element
                var firstInvalid = elem[0].querySelector('.ng-invalid');

                // if we find one, set focus
                if (firstInvalid) {
                    firstInvalid.focus();
                }
            });
        }
    };
});*/