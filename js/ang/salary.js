var years= [2016,2017,2018,2019,2020];
var months= [{ name: "January", id: 0 }, { name: "February", id: 1 }, { name: "March", id: 2 }, { name: "April", id: 3 },
                    { name: "May", id: 4 }, { name: "June", id: 5 }, { name: "July", id: 6 }, { name: "August", id: 7 },
                    { name: "September", id: 8 }, { name: "October", id: 9 }, { name: "November", id: 10 }, { name: "December", id: 11 }
                   ];

angular.module("app").controller('salaryStructure', function ($scope, userService, $location) {

    $scope.response = {};
    console.log("Salary structure loaded ..");
    userService.initLoader($scope);
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
        if(type == 'add') {
            salary.rule = $scope.allowance;
            salary.description = $("#allowance").text();
        } else {
            salary.rule = $scope.deduction;
            salary.description = $("#deduction").text();
        }
        if(!salary.rule) {
            if(type == 'add') {
                $scope.allowanceError = true;
            } else {
                $scope.deductionError = true;
            }
            return;
        }
        salary.amount = 0;
        salary.percentage = 0;
        salary.amountType = 'percentage';
        if(salary.rule == 'Custom') {
            salary.customRule = true;
        }
        $scope.user.company.salaryInfo.push(salary);
    }

    $scope.remove = function (item) {
        var index = $scope.user.company.salaryInfo.indexOf(item);
        $scope.user.company.salaryInfo.splice(index, 1);
    }


    $scope.getSalaryStructure = function () {
        
        userService.showLoading($scope);
       
        $scope.dataObj.user = $scope.user;
        userService.callService($scope, "/getSalaryStructure").then(function (response) {
            //$.skylo('end');
            userService.initLoader($scope);
            $scope.response = response;
            userService.showResponse($scope, "");
            $scope.user.company = response.company;
            //console.log(response.user.company);

        });
    }


    $scope.save = function () {

        if($scope.user.company.basic == null || $scope.user.company.basic.percentage < 0) {
            $scope.basicError = true;
            return;
        }
        var i = 0;
        for(i = 0; i < $scope.user.company.salaryInfo.length; i++) {
            var sal = $scope.user.company.salaryInfo[i];
            if(!sal.rule || !sal.percentage || !sal.amountType || (sal.percentage > 100 && sal.amountType == 'percentage')) {
                console.log("Error in salary info..");
                sal.error = true;
                return;
            }
        }
        userService.showLoading($scope);
        $scope.dataObj.user = $scope.user
        userService.callService($scope, "/addSalaryStructure").then(function (response) {
            //$.skylo('end');
            userService.initLoader($scope);
            $scope.response = response;
            userService.showResponse($scope, "Salary structure updated successfully!");
            //$("#myModal").modal('show');
            //console.log(response.user.company);

        });
    }

    $scope.getSalaryStructure();

});

angular.module("app").controller('employeeSalarySlips', function ($scope, userService, $location) {

    $scope.response = {};
    $scope.month = {};
    $scope.selectedEmployees = [];
    
    console.log("Employee Salary Slips loaded ..");
    userService.initLoader($scope);
    $scope.dataObj = {};
    $scope.user = JSON.parse(localStorage.erpUser);
    $scope.user.company.filter = {};
    $scope.basicError = false;
    $scope.years = years;
    $scope.months = months;
    $scope.month = $scope.months[new Date().getMonth()];
    $scope.year = new Date().getYear() + 1900;
    console.log("Month:" + $scope.month.id + " Year:" + $scope.year);
    $scope.url = root;
    console.log(root);
    
    /*$.skylo({
        state: 'success',
        inchSpeed: 200,
        initialBurst: 30,
        flat: false
    });*/


    
    $scope.getAllEmployeeSalary = function () {
        userService.showLoading($scope);
        $scope.user.company.filter.month = $scope.month.id;
        $scope.user.company.filter.year = $scope.year;
        $scope.dataObj.user = $scope.user;
        userService.callService($scope, "/getAllEmployeeSalaryInfo").then(function (response) {
            //$.skylo('end');
            userService.initLoader($scope);
            $scope.response = response;
            userService.showResponse($scope, "");
            $scope.employees = response.company.employees;
            //console.log("2 Month:" + $scope.month + " Year:" + $scope.year);

        });
    }
    
    $scope.selectEmployee = function(employee) {
        if(employee.selected) {
            employee.selected = false
        } else {
            employee.selected = true;
        }
        console.log("Count:" + $scope.selectedEmployees.length);
    }
    
    $scope.downloadBankStatement = function() {
        var i = 0;
        var employeeIds = "";
        for(i = 0; i< $scope.employees.length; i++ ) {
            if($scope.employees[i].selected) {
                employeeIds = employeeIds + $scope.employees[i].id + ",";
            }
        }
        if(employeeIds == "") {
            employeeIds = " ";
        }
        var fullUrl = root + "/downloadBankStatement/"+ $scope.user.company.id + "/" + employeeIds + "/"+ $scope.year + "/"+ $scope.month.id;
        console.log("URL:" + fullUrl);
        window.location.href = fullUrl;
    }
    
    $scope.downloadMaster = function() {
        var i = 0;
        var employeeIds = "";
        for(i = 0; i< $scope.employees.length; i++ ) {
            if($scope.employees[i].selected) {
                employeeIds = employeeIds + $scope.employees[i].id + ",";
            }
        }
        if(employeeIds == "") {
            employeeIds = " ";
        }
        var fullUrl = root + "/downloadSalaryMaster/"+ $scope.user.company.id + "/" + employeeIds + "/"+ $scope.year + "/"+ $scope.month.id;
        console.log("URL:" + fullUrl);
        window.location.href = fullUrl;
    }
    
    $scope.edit = function(emp) {
        emp.company = $scope.user.company;
        localStorage.empFinancial = JSON.stringify(emp);
        window.location.href = "#employeeSalary";
    }
    
    $scope.viewDetails = function(emp) {
        emp.company = $scope.user.company;
        localStorage.empFinancial = JSON.stringify(emp);
        window.location.href = "#employeeSalarySlip";
    }

        
    $scope.getAllEmployeeSalary();

});

angular.module("app").controller('employeeSalary', function ($scope, userService, $location) {

    $scope.response = {};
    console.log("Employee Salary structure loaded ..");
    userService.initLoader($scope);
    $scope.dataObj = {};
    $scope.user = JSON.parse(localStorage.erpUser);
    $scope.basicError = false;
    if(localStorage.empFinancial != null && localStorage.empFinancial != 'null') {
        //console.log(localStorage.empFinancial);
        $scope.employee = JSON.parse(localStorage.empFinancial);
        $scope.salary = $scope.employee.financial.salary;
        console.log("Salary :" + $scope.salary);
    }

    /*$.skylo({
        state: 'success',
        inchSpeed: 200,
        initialBurst: 30,
        flat: false
    });*/


    $scope.getSalaryStructure = function () {
        
        userService.showLoading($scope);
        $scope.user.company.currentEmployee = $scope.employee;
        $scope.dataObj.user = $scope.user;
        userService.callService($scope, "/getSalaryStructure").then(function (response) {
            //$.skylo('end');
            userService.initLoader($scope);
            $scope.response = response;
            userService.showResponse($scope, "");
            $scope.user.company = response.company;
            //console.log(response.user.company);

        });
    }
    
    $scope.getAllEmployees = function () {
        userService.showLoading($scope);
        $scope.dataObj.user = $scope.user;
        userService.callService($scope, "/getAllEmployees").then(function (response) {
            //$.skylo('end');
            userService.initLoader($scope);
            $scope.response = response;
            userService.showResponse($scope, "");
            $scope.employees = response.user.company.employees;

        });
    }
    
    $scope.getAmount = function(salaryInfo) {
        console.log("Salary Info :" + salaryInfo.amount + ":" + salaryInfo.rule);
        if(salaryInfo.amountType == 'percentage' && !salaryInfo.amount && $scope.salary > 0) {
            return Math.round((salaryInfo.percentage/100)*($scope.user.company.basic.percentage/100)*($scope.salary));
        } else {
            return salaryInfo.amount;
        }
    }
    
    $scope.getAmounts = function() {
        console.log("Getting amounts ..");
        $scope.user.company.basic.amount = ($scope.user.company.basic.percentage/100)*($scope.salary);
        $scope.getOthers();
    }
    
    $scope.getOthers = function() {
        for(i=0;i<$scope.user.company.salaryInfo.length;i++) {
            if($scope.user.company.salaryInfo[i].amountType == 'percentage') {
                $scope.user.company.salaryInfo[i].amount = Math.round(($scope.user.company.salaryInfo[i].percentage/100)*($scope.user.company.basic.amount));
            }   
        }
    }
    
    $scope.getTotal = function() {
        
        var total = ($scope.user.company.basic.amount);
        var i = 0;
        for(i=0;i<$scope.user.company.salaryInfo.length;i++) {
            if($scope.user.company.salaryInfo[i].type != 'add') {
                continue;
            }
            total = total + $scope.user.company.salaryInfo[i].amount;      
        }
        total = $scope.salary - total;
        console.log("Total:" + total);
        return total;
    }
    
    /*$scope.remove = function(item) {
        var index = $scope.user.company.salaryInfo.indexOf(item);
        $scope.user.company.salaryInfo.splice(index, 1);
        $scope.getAmounts();
    }*/

    $scope.save = function () {

        if($scope.employee == null) {
            $scope.salaryError = true;
            return;
        }
        
        if($scope.salary == null || $scope.salary < 0) {
            $scope.salaryError = true;
            return;
        }
        if(!$scope.user.company.basic.amount || $scope.user.company.basic.amount < 0) {
            $scope.salaryError = true;
            return;
        }
        userService.showLoading($scope);
        if($scope.employee.financial == null) {
            $scope.employee.financial = {};
        }
        $scope.employee.financial.salary = $scope.salary;
        $scope.employee.company = $scope.user.company;
        $scope.dataObj.user = $scope.employee;
        userService.callService($scope, "/addSalary").then(function (response) {
            //$.skylo('end');
            userService.initLoader($scope);
            $scope.response = response;
            userService.showResponse($scope, "Employee Salary updated successfully!");
            //$("#myModal").modal('show');
            //console.log(response.user.company);

        });
    }

    $scope.getAllEmployees();
    
    $scope.getSalaryStructure();

});

angular.module("app").controller('employeeSalarySlip', function ($scope, userService, $location) {

    $scope.emp = {};
    
    console.log("Employee Salary Slip loaded ..");
    userService.initLoader($scope);
    $scope.dataObj = {};
    $scope.user = JSON.parse(localStorage.erpUser);
    //console.log(localStorage.empFinancial);
    $scope.emp = JSON.parse(localStorage.empFinancial);
    
    $scope.month = months[$scope.emp.company.filter.month];
    $scope.year = $scope.emp.company.filter.year;
    console.log("Month:" + $scope.month.id + " Year:" + $scope.year);
    $scope.url = root;
  
});