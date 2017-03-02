function getDate($scope) {
    var d = new Date($scope.employee.joiningDate);
    var curr_date = d.getDate();
    var curr_month = d.getMonth() + 1; //Months are zero based
    var curr_year = d.getFullYear();
    if (curr_month < 10) {
        curr_month = "0" + curr_month;
    };
    if (curr_date < 10) {
        curr_date = "0" + curr_date;
    };
    var joiningDate = curr_year + "-" + curr_month + "-" + curr_date;
    return joiningDate;
}

angular.module("app").controller('employee', function ($scope, userService, $location) {

    $scope.response = {};
    $scope.dataObj = {
        user: {}
    };
    $scope.user = JSON.parse(localStorage.erpUser);
    console.log("Employee loaded .." + $scope.user.name);
    userService.initLoader($scope);
    $("#page1").show();
    $("#page2").hide();



    /*$.skylo({
        state: 'success',
        inchSpeed: 200,
        initialBurst: 30,
        flat: false
    });*/

    $scope.addExperience = function () {
        if (!$scope.yearFrom || !$scope.companyName) {
            alert("Please enter atleast the company Name and starting date of experience");
            return;
        }
        if ($scope.yearTo < $scope.yearFrom) {
            alert("From date cannot be greater than to date!");
            return;
        }
        var exp = {};
        exp.companyName = $scope.companyName;
        exp.fromYear = $scope.yearFrom;
        exp.toYear = $scope.yearTo;
        if ($scope.employee.experiences == null) {
            $scope.employee.experiences = [];
        }
        $scope.employee.experiences.push(exp);
    }

    $scope.removeExperience = function (exp) {
        $scope.employee.experiences.pop(exp)
    }

    $scope.addQualification = function () {
        if (!$scope.universityName || !$scope.to || !$scope.from) {
            alert("Please enter university name, from and to date of the qualification");
            return;
        }
        if ($scope.to < $scope.from) {
            alert("From date cannot be greater than to date!");
            return;
        }
        var exp = {};
        exp.companyName = $scope.universityName;
        exp.fromYear = $scope.from;
        exp.toYear = $scope.to;
        if ($scope.employee.qualifications == null) {
            $scope.employee.qualifications = [];
        }
        $scope.employee.qualifications.push(exp);
    }

    $scope.removeQualification = function (exp) {
        $scope.employee.qualifications.pop(exp)
    }

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
        joiningDate = getDate($scope);
        console.log(joiningDate);
        $scope.employee.joiningDate = joiningDate;
    }

    if (localStorage.erpViewEmployee != null && localStorage.erpViewEmployee != 'null') {
        console.log("Employee View found:" + localStorage.erpViewEmployee);
        $scope.emp = JSON.parse(localStorage.erpViewEmployee);
    }


    $scope.saveEmployee = function (formValid) {

        if (!formValid) {
            $scope.form2ShowErrors = true;
            return;
        }

        userService.showLoading($scope);

        // $scope.user.company.user = $scope.user;
        $scope.dataObj.user = $scope.employee;
        $scope.user = JSON.parse(localStorage.erpUser);
        $scope.dataObj.user.company = $scope.user.company;


        userService.callService($scope, "/addEmployee").then(function (response) {
            //$.skylo('end');
            userService.initLoader($scope);
            $scope.response = response;
            userService.showResponse($scope, "Employee details updated successfully!");

        });
    }


});


angular.module("app").controller('employees', function ($scope, userService, $location) {

    $scope.response = {};
    console.log("Employees loaded ..");
    userService.initLoader($scope);
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
        userService.showLoading($scope);
        $scope.dataObj.user = $scope.user;
        userService.callService($scope, "/getAllEmployees").then(function (response) {
            //$.skylo('end');
            userService.initLoader($scope);
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

        userService.showLoading($scope);
        // $scope.user.company.user = $scope.user;
        $scope.dataObj.user = $scope.employee;
        $scope.dataObj.user.employeeStatus = "D";

        userService.callService($scope, "/addEmployee").then(function (response) {
            //$.skylo('end');
            userService.initLoader($scope);
            $scope.response = response;
            userService.showResponse($scope, "Employee deleted successfully!");
            $scope.getAllEmployees();

        });
    }

    $scope.getAllEmployees();


});