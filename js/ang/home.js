angular.module("app").controller('home', function ($scope, userService, $location) {

    $scope.response = {};
    console.log("Home loaded ..");
    $scope.showProgress = false;

    if (localStorage.erpUser == null || localStorage.erpUser == 'null') {
        window.location.href = "index.html";
    }
    $scope.user = JSON.parse(localStorage.erpUser);

    /*$.skylo({
        state: 'success',
        inchSpeed: 200,
        initialBurst: 30,
        flat: false
    });*/

    $scope.getUser = function () {
        $scope.showProgress = true;

        userService.getUser($scope).then(function (response) {
            //$.skylo('end');
            $scope.showProgress = false;
            if (response == null || response.user == null) {
                $scope.response.responseText = "Error connecting server ..";
                return;
            }
            $scope.user = response.user;
            localStorage.erpUser = JSON.stringify($scope.user);
            if ($scope.user.company == null) {
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
    $scope.showProgress = false;

    /*$.skylo({
        state: 'success',
        inchSpeed: 200,
        initialBurst: 30,
        flat: false
    });*/

    $scope.saveCompany = function (formValid) {
        console.log("Terms :" + $scope.terms);
        if (!formValid) {
            $scope.companyFormShowErros = true;
            return;
        }

        $scope.showProgress = true;

        // $scope.user.company.user = $scope.user;
        $scope.dataObj.user = $scope.user;

        userService.addCompany($scope).then(function (response) {
            //$.skylo('end');
            $scope.showProgress = false;
            if (response == null) {
                $scope.response.responseText = "Error connecting server ..";
                return;
            }
            if (response.status != 200) {
                $scope.response.responseText = response.responseText;
                return;
            }
            window.location.href = "#home";

        });
    }


});

angular.module("app").controller('employee', function ($scope, userService, $location) {

    $scope.response = {};
    $scope.dataObj = {
        user: {}
    };
    $scope.user = JSON.parse(localStorage.erpUser);
    console.log("Employee loaded .." + $scope.user.company);
    $scope.showProgress = false;
    $("#page1").show();
    $("#page2").hide();
    /*$.skylo({
        state: 'success',
        inchSpeed: 200,
        initialBurst: 30,
        flat: false
    });*/
    
    $scope.showPage2 = function (formValid) {
        if (!formValid) {
            $scope.form1ShowErrors = true;
            return;
        }
        $("#page1").hide();
        $("#page2").show();
    }

    $scope.saveEmployee = function (formValid) {

        if (!formValid) {
            $scope.form2ShowErrors = true;
            return;
        }

        $scope.showProgress = true;

        // $scope.user.company.user = $scope.user;
        $scope.dataObj.user = $scope.employee;
        $scope.user = JSON.parse(localStorage.erpUser);
        $scope.dataObj.user.company = $scope.user.company;

        userService.addEmployee($scope).then(function (response) {
            //$.skylo('end');
            $scope.showProgress = false;
            if (response == null) {
                $scope.response.responseText = "Error connecting server ..";
                return;
            }
            if (response.status != 200) {
                $scope.response.responseText = response.responseText;
                return;
            }
            window.location.href = "#home";

        });
    }


});


angular.module("app").controller('employees', function ($scope, userService, $location) {

    $scope.response = {};
    console.log("Employees loaded ..");
    $scope.showProgress = false;
    $scope.dataObj = {};
    $scope.user = JSON.parse(localStorage.erpUser);

    /*$.skylo({
        state: 'success',
        inchSpeed: 200,
        initialBurst: 30,
        flat: false
    });*/

    $scope.getAllEmployees = function () {
        $scope.showProgress = true;
        $scope.dataObj.user = $scope.user;
        userService.getAllEmployees($scope).then(function (response) {
            //$.skylo('end');
            $scope.showProgress = false;
            if (response == null) {
                $scope.response.responseText = "Error connecting server ..";
                return;
            }
            $scope.response = response;
            console.log(response.user.company);

        });
    }

    $scope.getAllEmployees();


});
