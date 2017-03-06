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
        if($scope.leave.noOfDays < 0) {
            $scope.leave.noOfDays = 0;
        }
    }

    $scope.applyLeave = function (valid) {
        if (!valid) {
            $scope.showLeaveErrors = true;
            return;
        }
        if ($scope.leave.noOfDays <= 0) {
            $scope.incorrectDays = true;
            console.log("Incorrect days!");
            return;
        }
        if ($scope.leave.from > $scope.leave.to) {
            $scope.incorrectDate = true;
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
                $("#warningModal").modal('show');
                $scope.modalShown = true;
            } else {
                userService.showResponse($scope, "Leave applied successfully!");    
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

    $scope.getAllEmployeeLeaves = function () {
        userService.showLoading($scope);
        $scope.dataObj.user = $scope.user;
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

    /*$.skylo({
        state: 'success',
        inchSpeed: 200,
        initialBurst: 30,
        flat: false
    });*/

    $scope.showCancel = function(leave) {
        $scope.leave = leave;
        $scope.updateLeaveResponse = null;
        $("#myModal").modal('show');
    }
    

    $scope.getEmployeeLeaves = function () {
        userService.showLoading($scope);
        $scope.dataObj.user = $scope.employee;
        userService.callService($scope,"/getEmployeeLeaves").then(function (response) {
            //$.skylo('end');
            userService.initLoader($scope);
            $scope.response = response;
            userService.showResponse($scope,"");
            $scope.leaves = response.user.leaves;

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
            userService.showResponse($scope, "Leave updated successfully!");
            $scope.getEmployeeLeaves();
        });
    }

    $scope.getEmployeeLeaves();

});

angular.module("app").controller('editLeave', function ($scope, userService, $location) {

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


    $scope.getAllLeaveTypes = function () {
        userService.showLoading($scope);
        $scope.dataObj.user = $scope.user;
        userService.callService($scope, "/getAllLeaveTypes").then(function (response) {
            //$.skylo('end');
            userService.initLoader($scope);
            $scope.response = response;
            userService.showResponse($scope, "");
            $scope.leaveTypes = response.company.leaveTypes;
            //console.log(response.user.company);

        });
    }

    $scope.applyLeave = function (valid) {
        if (!valid) {
            $scope.showLeaveErrors = true;
            return;
        }
        if ($scope.leave.noOfDays <= 0) {
            $scope.incorrectDays = true;
            console.log("Incorrect days!");
            return;
        }
        userService.showLoading($scope);
        $scope.leave.appliedBy = $scope.user;
        $scope.dataObj.leave = $scope.leave;
        userService.callService($scope, "/applyLeave").then(function (response) {
            //$.skylo('end');
            userService.initLoader($scope);
            $scope.response = response;
            userService.showResponse($scope, "Leave applied successfully!");
            //$("#myModal").modal('show');
            //console.log(response.user.company);

        });
    }

    $scope.getAllLeaveTypes();
    
    //console.log("Leaves all loaded ..");


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