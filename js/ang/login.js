angular.module("app").controller('login', function ($scope, userService, $location) {

    $scope.response = {};
    $scope.dataObj = {};
    console.log("Loaded ..");
    userService.initLoader($scope);

    /*$.skylo({
        state: 'success',
        inchSpeed: 200,
        initialBurst: 30,
        flat: false
    });*/


    $scope.loginUser = function () {
       
       /* $scope.showProgress = true;
        $.skylo('start');
        $.skylo('inch', 5);*/
        userService.showLoading($scope);
        $scope.dataObj.user = $scope.user;
        userService.callService($scope,"/loginUser").then(function (response) {
            //$.skylo('end');
            userService.initLoader($scope);
            $scope.response = response;
            userService.showResponse($scope,"");
            if($scope.response == null || $scope.response.status != 200) {
                return;
            }
            localStorage.erpUser = JSON.stringify($scope.user);
            console.log("Successful!");
            window.location.href = "home.html";
            
           
        });

    };
    
    $scope.sendPassword = function() {
        userService.showLoading($scope);
        $scope.dataObj.user = $scope.user;
        userService.callService($scope,"/forgotPassword").then(function (response) {
            //$.skylo('end');
            userService.initLoader($scope);
            $scope.response = response;
            userService.showResponse($scope,"Password sent successfully!");
        });
    }
    
    $scope.close = function() {
        userService.close("login.html");
    }


});



