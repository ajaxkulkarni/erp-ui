angular.module("app").controller('salaryStructure', function ($scope, userService, $location) {

    $scope.response = {};
    console.log("Salary structure loaded ..");
    $scope.showProgress = false;
    $scope.dataObj = {};
    $scope.user = JSON.parse(localStorage.erpUser);
    $scope.basicError = false;

    /*$.skylo({
        state: 'success',
        inchSpeed: 200,
        initialBurst: 30,
        flat: false
    });*/

    $scope.add = function (type) {
        var salary = {};
        salary.type = type;
        salary.rule = $scope.allowance;
        salary.amount = 0;
        salary.percentage = 0;
        salary.description = $("#allowance").text();
        $scope.user.company.salaryInfo.push(salary);
    }

    $scope.remove = function (item) {
        var index = $scope.user.company.salaryInfo.indexOf(item);
        $scope.user.company.salaryInfo.splice(index, 1);
    }


    $scope.getSalaryStructure = function () {
        
        $scope.showProgress = true;
       
        $scope.dataObj.user = $scope.user;
        userService.callService($scope, "/getSalaryStructure").then(function (response) {
            //$.skylo('end');
            $scope.showProgress = false;
            $scope.response = response;
            userService.showResponse($scope, "");
            $scope.user.company = response.company;
            //console.log(response.user.company);

        });
    }


    $scope.save = function () {

        if($scope.user.company.basic == null || $scope.user.company.basic.percentage < 0) {
            $scope.basicError = true;
            $("#basic").focus();
            return;
        }
         
        $scope.showProgress = true;
        $scope.dataObj.user = $scope.user
        userService.callService($scope, "/addSalaryStructure").then(function (response) {
            //$.skylo('end');
            $scope.showProgress = false;
            $scope.response = response;
            userService.showResponse($scope, "Salary structure updated successfully!");
            //$("#myModal").modal('show');
            //console.log(response.user.company);

        });
    }

    $scope.getSalaryStructure();

});

angular.module("app").controller('employeeSalary', function ($scope, userService, $location) {

    $scope.response = {};
    console.log("Employee Salary structure loaded ..");
    $scope.showProgress = false;
    $scope.dataObj = {};
    $scope.user = JSON.parse(localStorage.erpUser);
    $scope.basicError = false;

    /*$.skylo({
        state: 'success',
        inchSpeed: 200,
        initialBurst: 30,
        flat: false
    });*/


    $scope.getSalaryStructure = function () {
        
        $scope.showProgress = true;
       
        $scope.dataObj.user = $scope.user;
        userService.callService($scope, "/getSalaryStructure").then(function (response) {
            //$.skylo('end');
            $scope.showProgress = false;
            $scope.response = response;
            userService.showResponse($scope, "");
            $scope.user.company = response.company;
            //console.log(response.user.company);

        });
    }
    
    $scope.getAllEmployees = function () {
        $scope.showProgress = true;
        $scope.dataObj.user = $scope.user;
        userService.callService($scope, "/getAllEmployees").then(function (response) {
            //$.skylo('end');
            $scope.showProgress = false;
            $scope.response = response;
            userService.showResponse($scope, "");
            $scope.employees = response.user.company.employees;

        });
    }
    
    $scope.getTotal = function() {
        if($scope.employee == null) {
            return;
        }
        var total = ($scope.user.company.basic.percentage/100)*($scope.employee.salary);
        var i = 0;
        for(i=0;i<$scope.user.company.salaryInfo.length;i++) {
            total = total + ($scope.user.company.salaryInfo[i].percentage/100)*($scope.user.company.basic.percentage/100)*($scope.employee.salary);
        }
        total = $scope.employee.salary - total;
        console.log("Total:" + total);
        return total;
    }


    $scope.save = function () {

        if($scope.user.company.basic == null || $scope.user.company.basic.percentage < 0) {
            $scope.basicError = true;
            $("#basic").focus();
            return;
        }
         
        $scope.showProgress = true;
        $scope.dataObj.user = $scope.user
        userService.callService($scope, "/addSalaryStructure").then(function (response) {
            //$.skylo('end');
            $scope.showProgress = false;
            $scope.response = response;
            userService.showResponse($scope, "Salary structure updated successfully!");
            //$("#myModal").modal('show');
            //console.log(response.user.company);

        });
    }

    $scope.getAllEmployees();
    
    $scope.getSalaryStructure();

});