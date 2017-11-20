// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'

'use strict';

var hreasy=angular.module('app',['ionic'])

var host = "http://45.79.135.189:8080/erp";
var root = host + "/service";
var projectRoot = host + "/projectService"
var rootAdmin = host + "/adminService";



hreasy.service('userService', function ($http, $q) {

    var response = {};

    this.showResponse = function ($scope, successMsg, successLink) {
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
            if (successMsg == "") {
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
        } else {
            $("#errorModal").modal('show');
        }
        //console.log("Response :" + $scope.response.reseponseText);
    }

    this.showLoading = function ($scope) {
        console.log("Showing loader..");
        $scope.showProgress = true;
        console.log("Loaded loader..");
    }

    this.initLoader = function ($scope) {
        $scope.showProgress = false;
        console.log("Hiding loader..");

    }

    this.validationError = function ($scope, msg) {
        $scope.errorText = msg;
        $("#warningModal").modal('show');
    }

    this.close = function (url) {
        $("#successModal").modal('hide');
        if (url != null && url != "") {
            window.location.href = url;
        }
    }

    this.callService = function ($scope, method, $root) {
        var defer = $q.defer();
        var url = root + method;
        if ($root == "P") {
            url = projectRoot + method;
        }
        var res = $http.post(url, $scope.dataObj);
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
hreasy.service('adminService', function ($http, $q) {

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



hreasy.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})
    hreasy.config(function ($stateProvider, $urlRouterProvider) {
    
 $stateProvider
    .state('login', {
      url: '/login',
      templateUrl: 'templates/login.html',
      controller: 'loginctrl'
    })
     .state('home', {
      url: '/home',
     
      templateUrl: 'templates/home.html',
     controller: 'home'
    })
    
       
    
    
    $urlRouterProvider.otherwise('/login');
})

hreasy.run(function ($rootScope, $location) {

    // register listener to watch route changes
    $rootScope.$on("$routeChangeStart", function (event, next, current) {
        var user = JSON.parse(localStorage.erpUser);
        //console.log("User:" + localStorage.erpUser);
        //console.log("Route changed!!" + next.templateUrl);
        /*if (next.templateUrl == null) {
            return;
        }*/
        if (user != null && user.name != null) {
            // no logged user, we should be going to #login
            if (user.status == 'P') {
                if (next.templateUrl != "password_reset.html") {
                    //window.location.href = "#changePassword";
                    $location.path("/changePassword");
                }
            } else if (user.company == null && user.loginType != 'Employee') {
                if (next.templateUrl != "company_details.html") {
                    //window.location.href = "#companyDetails";
                    $location.path("/companyDetails");
                }
            }
        }
    });
});

hreasy.directive('fileModel', ['$parse', function ($parse) {
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

hreasy.directive('focusMe', function ($timeout) {
    return {
        scope: {
            trigger: '@focusMe'
        },
        link: function (scope, element) {
            scope.$watch('trigger', function (value) {
                //alert(value);
                if (value === "true") {
                    $timeout(function () {
                        element[0].focus();
                    });
                }
            });
        }
    };
});

