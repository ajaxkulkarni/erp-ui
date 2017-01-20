angular.module("app").controller('admin', function ($scope, adminService, $location) {

    $scope.response = {};
    console.log("Admin loaded ..");
    $scope.showProgress = false;

    /*$.skylo({
        state: 'success',
        inchSpeed: 200,
        initialBurst: 30,
        flat: false
    });*/


    $scope.getAllUsers = function () {

       /* $scope.showProgress = true;
        $.skylo('start');
        $.skylo('inch', 5);*/
        
        $scope.showProgress = true;
        
        adminService.getAllUsers().then(function (response) {
            //$.skylo('end');
            $scope.showProgress = false;
            if (response == null) {
                $scope.response.responseText = "Error connecting server ..";
            }
            $scope.response = response;
            //console.log(response.users);
        });

    };
    
    $scope.getAllUsers();
    
    $scope.activate = function (user) {
        $scope.showProgress = true;
        
        adminService.activateUser(user).then(function (response) {
            //$.skylo('end');
            $scope.showProgress = false;
            if (response == null) {
                $scope.response.responseText = "Error connecting server ..";
            }
            $scope.response = response;
            $scope.getAllUsers();
            //console.log(response.users);
        });
    }


});



