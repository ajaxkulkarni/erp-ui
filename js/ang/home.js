angular.module("app").controller('home', function ($scope, userService, $location) {

    $scope.response = {};
    $scope.dataObj = {};
    console.log("Home loaded ..");
    userService.initLoader($scope);
    //alert("Before close!");
    $("#successModal").hide();
    $('body').removeClass('modal-open');
    $('.modal-backdrop').remove();
    

    if (localStorage.erpUser == null || localStorage.erpUser == 'null') {
        window.location.href = "index.html";
    }
    
    localStorage.erpEmployee = null;
    
    $scope.user = JSON.parse(localStorage.erpUser);

    /*$.skylo({
        state: 'success',
        inchSpeed: 200,
        initialBurst: 30,
        flat: false
    });*/

    $scope.getUser = function () {
        userService.showLoading($scope);
        console.log("Prog:" + $scope.showProgress);
        $scope.dataObj.user = $scope.user;
        userService.callService($scope, "/getUser").then(function (response) {
            //$.skylo('end');
            userService.initLoader($scope);
            $scope.response = response;
            userService.showResponse($scope, "");
            if ($scope.response == null || $scope.response.status != 200) {
                return;
            }
            $scope.user = response.user;
            localStorage.erpUser = JSON.stringify($scope.user);
            if($scope.user.status == 'P') {
                window.location.href = "#changePassword";
            } else if ($scope.user.company == null) {
                window.location.href = "#companyDetails";
            } else {
                window.location.href = "#home";
            }

        });
    }

    $scope.getUser();


});

angular.module("app").controller('company', function ($scope, userService, $location) {

    $scope.response = {};
    $scope.dataObj = {
        user: {}
    };
    $scope.user = JSON.parse(localStorage.erpUser);
    console.log("Company loaded .." + $scope.user.email);
    userService.initLoader($scope);

    /*$.skylo({
        state: 'success',
        inchSpeed: 200,
        initialBurst: 30,
        flat: false
    });*/
    if($scope.user.company == null) {
        $scope.user.company = {};
    }
    else if($scope.user.company.name!= null && $scope.user.company.name.length > 0) {
        $scope.nameReadOnly = true;
    }

    $scope.saveCompany = function (formValid) {
        console.log("Terms :" + $scope.terms);
        if (!formValid) {
            $scope.companyFormShowErros = true;
            return;
        }

        userService.showLoading($scope);

        // $scope.user.company.user = $scope.user;
        $scope.dataObj.user = $scope.user;

        userService.callService($scope, "/addCompany").then(function (response) {
            //$.skylo('end');
            userService.initLoader($scope);
            $scope.response = response;
            userService.showResponse($scope, "Company details updated successfully!");
            //window.location.href = "#home";

        });
    }
    
    $scope.close = function() {
        userService.close("#main");
    }


});

angular.module("app").controller('profile', function ($scope, userService, $location) {

    $scope.response = {};
    $scope.dataObj = {
        user: {}
    };
    if(localStorage.erpUser == null || localStorage.erpUser == 'null') {
        return;
    }
    $scope.user = JSON.parse(localStorage.erpUser);
    console.log("Profile loaded .." + $scope.user.email);
    userService.initLoader($scope);

    /*$.skylo({
        state: 'success',
        inchSpeed: 200,
        initialBurst: 30,
        flat: false
    });*/

    $scope.changePassword = function (formValid) {
        if (!formValid) {
            $scope.passwordErrors = true;
            return;
        }
        if($scope.user.newPassword != $scope.confirmPassword) {
            console.log($scope.user.newPassword + " !=: " + $scope.confirmPassword);
            $scope.passwordMatchErrors = true;
            return;
        }
        userService.showLoading($scope);

        // $scope.user.company.user = $scope.user;
        $scope.dataObj.user = $scope.user;

        userService.callService($scope, "/changePassword").then(function (response) {
            //$.skylo('end');
            userService.initLoader($scope);
            $scope.response = response;
            userService.showResponse($scope, "Password changed successfully!");
            //window.location.href = "#home";

        });
    }


});
