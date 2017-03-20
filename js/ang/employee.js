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
            userService.validationError($scope,"Please enter atleast the company Name and starting date of experience");
            return;
        }
        if ($scope.yearTo < $scope.yearFrom) {
            userService.validationError($scope,"From date cannot be greater than to date!");
            return;
        }
        var exp = {};
        exp.companyName = $scope.companyName;
        exp.fromYear = $scope.yearFrom;
        exp.toYear = $scope.yearTo;
        exp.designation = $scope.designation;
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
            userService.validationError($scope,"Please enter university name, from and to date of the qualification");
            return;
        }
        if ($scope.to < $scope.from) {
            userService.validationError($scope,"From date cannot be greater than to date!");
            return;
        }
        var exp = {};
        exp.companyName = $scope.universityName;
        exp.fromYear = $scope.from;
        exp.toYear = $scope.to;
        exp.designation = $scope.degree;
        exp.specialization = $scope.subject;
        if ($scope.employee.qualifications == null) {
            $scope.employee.qualifications = [];
        }
        $scope.employee.qualifications.push(exp);
    }

    $scope.removeQualification = function (exp) {
        $scope.employee.qualifications.pop(exp)
    }
    
    $scope.goToAddEmp = function() {
        localStorage.erpEmployee = null;
        window.location.href = "#addEmployee";
    }


    if (localStorage.erpEmployee != null && localStorage.erpEmployee != 'null') {
        console.log("Employee found:" + localStorage.erpEmployee);
        $scope.employee = JSON.parse(localStorage.erpEmployee);
        joiningDate = getDate($scope);
        console.log(joiningDate);
        $scope.employee.joiningDate = joiningDate;
        $scope.title = "Edit Employee";
        $scope.backLink = "#viewEmployees";
    } else {
        $scope.employee = {};
        $scope.title = "Add new Employee";
        $scope.backLink = "#employees";
    }

    if (localStorage.erpViewEmployee != null && localStorage.erpViewEmployee != 'null') {
        console.log("Employee View found:" + localStorage.erpViewEmployee);
        $scope.emp = JSON.parse(localStorage.erpViewEmployee);
    }

    function setFocus(form) {
        //console.log("setting focus.." + $scope.employee.name);
        if(form.name.$invalid) {
            $scope.nameInvalid = true;
            $scope.tab = 1;
        }
        else if(form.email.$invalid) {
            $scope.emailInvalid = true;
            $scope.tab = 1;
        }
        else if(form.designation.$invalid) {
            $scope.designationInvalid = true;
            $scope.tab = 1;
        }
        else if(form.type.$invalid) {
            $scope.typeInvalid = true;
            $scope.tab = 1;
        }
    };

    $scope.saveEmployee = function (form) {
        if (!form.$valid) {
            $scope.formShowErrors = true;
            setFocus(form);
            return;
        }

        userService.showLoading($scope);

        // $scope.user.company.user = $scope.user;
        $scope.dataObj.user = $scope.employee;
        $scope.user = JSON.parse(localStorage.erpUser);
        $scope.dataObj.user.company = $scope.user.company;

        //console.log("Qual:" + $scope.dataObj.user.qualifications);
        userService.callService($scope, "/addEmployee").then(function (response) {
            //$.skylo('end');
            userService.initLoader($scope);
            $scope.response = response;
            userService.showResponse($scope, "Employee details updated successfully!","employees");

        });
    }
    
     $scope.close = function() {
        userService.close("#viewEmployees");
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
            userService.showResponse($scope, "Employee deleted successfully!","employees");
            $scope.getAllEmployees();

        });
    }
    
     $scope.close = function() {
        userService.close("");
    }

    $scope.getAllEmployees();


});