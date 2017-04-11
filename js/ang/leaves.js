var leaveYears = [2016,2017,2018,2019,2020];
var leaveMonths = [{name:"Whole Year", id: 15}, { name: "January", id: 0 }, { name: "February", id: 1 }, { name: "March", id: 2 }, { name: "April", id: 3 },
                    { name: "May", id: 4 }, { name: "June", id: 5 }, { name: "July", id: 6 }, { name: "August", id: 7 },
                    { name: "September", id: 8 }, { name: "October", id: 9 }, { name: "November", id: 10 }, { name: "December", id: 11 }
                   ];


angular.module("app").controller('leaves', function ($scope, userService, $location) {

    $scope.response = {};
    console.log("Leaves loaded ..");
    userService.initLoader($scope);
    $scope.dataObj = {};
    $scope.user = JSON.parse(localStorage.erpUser);

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
            $scope.employees = response.user.company.employees;
            if($scope.employees == null || $scope.employees.length == 0) {
                $scope.noEmployees = true;
                userService.validationError($scope, "No Employee record found for your company. Please add employees first.");
            }
            console.log("Company:" + JSON.stringify(response.user.company));

        });
    }

    $scope.getAllLeaveTypes = function () {
        userService.showLoading($scope);
        $scope.dataObj.user = $scope.user;
        userService.callService($scope, "/getAllLeaveTypes").then(function (response) {
            //$.skylo('end');
            userService.initLoader($scope);
            $scope.response = response;
            userService.showResponse($scope, "");
            $scope.leaveTypes = response.company.leaveTypes;
            if($scope.leaveTypes == null || $scope.leaveTypes.length == 0) {
                if($scope.noEmployees) {
                    return;
                }
                userService.validationError($scope, "Please define a leave structure for your company first.");
            }
            //console.log(response.user.company);

        });
    }
    
    $scope.calculateDays = function () {
        var time1 = new Date($scope.leave.to).getTime();
        var time2 = new Date($scope.leave.from).getTime();
        $scope.leave.noOfDays = 1 + (time1 - time2)/(3600*24*1000);
        if($scope.leave.noOfDays <= 0) {
            $scope.incorrectDate = true;
            $scope.leave.noOfDays = 0;
        } else {
            $scope.incorrectDate = false;
        }
    }
    
    function setFocus(form) {
        //console.log("setting focus.." + $scope.employee.name);
        if(form.employee.$invalid) {
            $scope.invalidEmployee = true;
            return;
        }
        else if(form.from.$invalid) {
            $scope.invalidFrom = true;
            return;
        }
        else if(form.to.$invalid || $scope.incorrectDate) {
            $scope.invalidTo = true;
            return;
        }
        else if(form.days.$invalid || $scope.incorrectDays) {
            $scope.invalidDays = true;
            return;
        }
        else if(form.type.$invalid) {
            $scope.invalidType = true;
            return;
        }
    };
    
     $scope.close = function() {
        userService.close("#viewLeaves");
    }

    $scope.applyLeave = function (form) {
        if (!form.$valid) {
            $scope.showLeaveErrors = true;
            setFocus(form);
            return;
        }
        if ($scope.leave.noOfDays <= 0) {
            $scope.incorrectDays = true;
            setFocus(form);
            console.log("Incorrect days!");
            return;
        }
        if ($scope.leave.from > $scope.leave.to) {
            $scope.incorrectDate = true;
            setFocus(form);
            console.log("Incorrect date!");
            return;
        }
       
        
        //if($scope.user.)
        userService.showLoading($scope);
        $scope.leave.appliedBy = $scope.user;
        $scope.dataObj.leave = $scope.leave;
         if($scope.modalShown) {
            $scope.dataObj.leave.approval = 'Y';
        }
        userService.callService($scope, "/applyLeave").then(function (response) {
            //$.skylo('end');
            userService.initLoader($scope);
            $scope.response = response;
            if($scope.response.status == -101) {
                console.log("Exceeded limit!");
                $("#leaveWarningModal").modal('show');
                $scope.modalShown = true;
            } else {
                userService.showResponse($scope, "Leave applied successfully!","leavesData");    
            }
            //$("#myModal").modal('show');
            //console.log(response.user.company);

        });
    }

    $scope.getAllEmployees();

    $scope.getAllLeaveTypes();


});

angular.module("app").controller('leavesData', function ($scope, userService, $location) {

    $scope.response = {};
    console.log("Leaves Data loaded ..");
    userService.initLoader($scope);
    $scope.dataObj = {};
    $scope.user = JSON.parse(localStorage.erpUser);

    /*$.skylo({
        state: 'success',
        inchSpeed: 200,
        initialBurst: 30,
        flat: false
    });*/
    
    $scope.years = leaveYears;
    $scope.months = leaveMonths;
    console.log(leaveMonths);
    $scope.month = leaveMonths[0];
    $scope.year = new Date().getYear() + 1900;
    console.log(" Year:" + $scope.year);
    $scope.root = root;

    $scope.getAllEmployeeLeaves = function () {
        if($scope.user.company.filter == null) {
            $scope.user.company.filter = {};
        }
        if($scope.month.id != 15) {
            $scope.user.company.filter.month = $scope.month.id;
        } else {
            $scope.user.company.filter.month = null;
        }
        $scope.user.company.filter.year = $scope.year;
        console.log("Filter:" + JSON.stringify($scope.user.company.filter));
        $scope.dataObj.user = $scope.user;
        userService.showLoading($scope);
        userService.callService($scope, "/getAllLeaves").then(function (response) {
            //$.skylo('end');
            userService.initLoader($scope);
            $scope.response = response;
            userService.showResponse($scope,"");
            $scope.employees = response.company.employees;
            $scope.leaveTypes = response.company.leaveTypes;

            //console.log(response.user.company);

        });
    }
    

    $scope.viewDetails = function (emp) {
        emp.company = $scope.user.company;
        localStorage.erpEmployee = JSON.stringify(emp);
        window.location.href = "#leaveDetails";
    }


    $scope.getAllEmployeeLeaves();

});

angular.module("app").controller('leaveDetails', function ($scope, userService, $location) {

    $scope.response = {};
    console.log("Leaves Details loaded ..");
    userService.initLoader($scope);
    $scope.dataObj = {};
    $scope.user = JSON.parse(localStorage.erpUser);
    $scope.employee = JSON.parse(localStorage.erpEmployee);
    $scope.root = root;

    /*$.skylo({
        state: 'success',
        inchSpeed: 200,
        initialBurst: 30,
        flat: false
    });*/
    
    $scope.close = function() {
        userService.close("");
    }

    $scope.showCancel = function(leave) {
        $scope.leave = leave;
        $scope.updateLeaveResponse = null;
        $("#myModal").modal('show');
    }
    
    $scope.editable = function(val) {
        if(val == 'true') {
            $scope.leaveBalance = $.extend(true,{},$scope.user.leaveBalance);
        }
        if(val == 'false') {
            $scope.user.leaveBalance = $scope.leaveBalance;
        }
        $scope.editBalance = val;
    }
    

    $scope.getEmployeeLeaves = function () {
        userService.showLoading($scope);
        $scope.dataObj.user = $scope.employee;
        console.log("Employee :" + JSON.stringify($scope.employee));
        userService.callService($scope,"/getEmployeeLeaves").then(function (response) {
            //$.skylo('end');
            userService.initLoader($scope);
            $scope.response = response;
            userService.showResponse($scope,"");
            $scope.employee = response.user;
            $scope.leaves = response.user.leaves;

        });
    }
    
    $scope.updateLeaveBalance = function() {
        
        userService.showLoading($scope);
        $scope.dataObj.user = $scope.user;
        userService.callService($scope, '/updateLeaveBalance').then(function (response) {
            //$.skylo('end');
            userService.initLoader($scope);
            $scope.response = response;
            //$("#myModal").modal('hide');
            userService.showResponse($scope, "Leave balance updated successfully!","leaveDetails");
            $scope.editBalance = 'false';
            $scope.getEmployeeLeaves();
        });
    }
    
    $scope.cancelLeave = function() {
        $scope.leave.status = "Cancelled";
        userService.showLoading($scope);
        $scope.dataObj.leave = $scope.leave;
        userService.callService($scope, '/updateLeave').then(function (response) {
            //$.skylo('end');
            userService.initLoader($scope);
            $scope.response = response;
            $("#myModal").modal('hide');
            userService.showResponse($scope, "Leave updated successfully!","leaveDetails");
            $scope.getEmployeeLeaves();
        });
    }

    $scope.getEmployeeLeaves();

});


angular.module("app").controller('leavePolicy', function ($scope, userService, $location) {

    $scope.response = {};
    console.log("Leave Policy loaded ..");
    userService.initLoader($scope);
    $scope.dataObj = {};
    $scope.user = JSON.parse(localStorage.erpUser);

    /*$.skylo({
        state: 'success',
        inchSpeed: 200,
        initialBurst: 30,
        flat: false
    });*/


    $scope.getAllLeaveTypes = function () {
        userService.showLoading($scope);
        $scope.dataObj.user = $scope.user;
        $scope.dataObj.requestType = "ALL";
        userService.callService($scope, '/getAllLeaveTypes').then(function (response) {
            //$.skylo('end');
            userService.initLoader($scope);
            $scope.response = response;
            userService.showResponse($scope,"");
            $scope.leaveTypes = response.company.leaveTypes;
            //console.log(response.user.company);

        });
    }
    
     $scope.close = function() {
        userService.close("#leaves");
     }   
    

    $scope.addLeavePolicy = function () {
        //console.log("Scope :" + $scope.user.company + " actual " + JSON.stringify($scope.leaveTypes));
        //$scope.user.company.leavePolicy = $scope.company.leavePolicy;
        userService.showLoading($scope);
        $scope.user.company.leaveTypes = $scope.leaveTypes;
        $scope.dataObj.user = $scope.user;
        userService.callService($scope, '/addLeavePolicy').then(function (response) {
            //$.skylo('end');
            userService.initLoader($scope);
            $scope.response = response;
            userService.showResponse($scope, "Leave policy updated!");
        });
    }

    $scope.getAllLeaveTypes();


});