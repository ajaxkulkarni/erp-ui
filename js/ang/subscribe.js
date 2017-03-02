angular.module("app").controller('subscribe', function ($scope, userService, $location) {

    console.log("Loaded init ..");
    $scope.response = {};
    $scope.dataObj = {};
    userService.initLoader($scope);

    /*$.skylo({
        state: 'success',
        inchSpeed: 200,
        initialBurst: 30,
        flat: false
    });*/


    $scope.goToLogin = function() {
        window.location.href = "login.html";
    }
    
    $scope.subscribeUser = function (formValid) {
        if (!formValid) {
            $scope.subscribeShowErrors = true;
            return;
        }

       /* $scope.showProgress = true;
        $.skylo('start');
        $.skylo('inch', 5);*/
        
        userService.showLoading($scope);
        $scope.dataObj.user = $scope.user;
        userService.callService($scope, "/subscribeUser").then(function (response) {
            //$.skylo('end');
            userService.initLoader($scope);
            $scope.response = response;
            userService.showResponse($scope, "Your application is submitted successfully. Our team will soon contact you for further process.")
        });

    };


});



