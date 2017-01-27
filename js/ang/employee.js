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

    if (localStorage.erpEmployee != null && localStorage.erpEmployee != 'null') {
        console.log("Employee found:" + localStorage.erpEmployee);
        $scope.employee = JSON.parse(localStorage.erpEmployee);
    }
    
    if(localStorage.erpViewEmployee != null && localStorage.erpViewEmployee != 'null') {
        console.log("Employee View found:" + localStorage.erpViewEmployee);
        $scope.emp = JSON.parse(localStorage.erpViewEmployee);
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


        userService.callService($scope, "/addEmployee").then(function (response) {
            //$.skylo('end');
            $scope.showProgress = false;
            $scope.response = response;
            userService.showResponse($scope, "Employee details updated successfully!");

        });
    }


});


angular.module("app").controller('employees', function ($scope, userService, $location) {

    $scope.response = {};
    console.log("Employees loaded ..");
    $scope.showProgress = false;
    $scope.dataObj = {};
    $scope.user = JSON.parse(localStorage.erpUser);
    localStorage.erpEmployee = null;
    /*$.skylo({
        state: 'success',
        inchSpeed: 200,
        initialBurst: 30,
        flat: false
    });*/

    $scope.getAllEmployees = function () {
        $scope.showProgress = true;
        $scope.dataObj.user = $scope.user;
        userService.callService($scope, "/getAllEmployees").then(function (response) {
            //$.skylo('end');
            $scope.showProgress = false;
            $scope.response = response;
            userService.showResponse($scope, "");

        });
    }

    $scope.edit = function (emp) {
        localStorage.erpEmployee = JSON.stringify(emp);
        window.location.href = "#addEmployee";
    }
    
    $scope.view = function (emp) {
        localStorage.erpViewEmployee = JSON.stringify(emp);
        window.location.href = "#viewEmployee";
    }

    $scope.delete = function (emp) {
        $scope.employee = emp;
        $("#deleteModal").modal('show');
    }

    $scope.deleteEmployee = function () {

        $scope.showProgress = true;
        // $scope.user.company.user = $scope.user;
        $scope.dataObj.user = $scope.employee;
        $scope.dataObj.user.employeeStatus = "D";

        userService.callService($scope, "/addEmployee").then(function (response) {
            //$.skylo('end');
            $scope.showProgress = false;
            $scope.response = response;
            userService.showResponse($scope, "Employee deleted successfully!");
            $scope.getAllEmployees();

        });
    }

    $scope.getAllEmployees();


});