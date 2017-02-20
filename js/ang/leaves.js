angular.module("app").controller('leaves', function ($scope, userService, $location) {

    $scope.response = {};
    console.log("Leaves loaded ..");
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
        userService.callService($scope, "/getAllEmployees").then(function (response) {
            //$.skylo('end');
            $scope.showProgress = false;
            $scope.response = response;
            userService.showResponse($scope, "");
            $scope.employees = response.user.company.employees;
            console.log("Company:" + JSON.stringify(response.user.company));

        });
    }

    $scope.getAllLeaveTypes = function () {
        $scope.showProgress = true;
        $scope.dataObj.user = $scope.user;
        userService.callService($scope, "/getAllLeaveTypes").then(function (response) {
            //$.skylo('end');
            $scope.showProgress = false;
            $scope.response = response;
            userService.showResponse($scope, "");
            $scope.leaveTypes = response.company.leaveTypes;
            //console.log(response.user.company);

        });
    }
    
    $scope.calculateDays = function () {
        $scope.leave.noOfDays = 1 + ($scope.leave.to - $scope.leave.from)/(3600*24*1000)
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
        $scope.showProgress = true;
        $scope.leave.appliedBy = $scope.user;
        $scope.dataObj.leave = $scope.leave;
         if($scope.modalShown) {
            $scope.dataObj.leave.approval = 'Y';
        }
        userService.callService($scope, "/applyLeave").then(function (response) {
            //$.skylo('end');
            $scope.showProgress = false;
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
    $scope.showProgress = false;
    $scope.dataObj = {};
    $scope.user = JSON.parse(localStorage.erpUser);

    /*$.skylo({
        state: 'success',
        inchSpeed: 200,
        initialBurst: 30,
        flat: false
    });*/

    $scope.getAllEmployeeLeaves = function () {
        $scope.showProgress = true;
        $scope.dataObj.user = $scope.user;
        userService.callService($scope, "/getAllLeaves").then(function (response) {
            //$.skylo('end');
            $scope.showProgress = false;
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
    $scope.showProgress = false;
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
        $scope.showProgress = true;
        $scope.dataObj.user = $scope.employee;
        userService.callService($scope,"/getEmployeeLeaves").then(function (response) {
            //$.skylo('end');
            $scope.showProgress = false;
            $scope.response = response;
            userService.showResponse($scope,"");
            $scope.leaves = response.user.leaves;

        });
    }
    
    $scope.cancelLeave = function() {
        $scope.leave.status = "Cancelled";
        $scope.showProgress = true;
        $scope.dataObj.leave = $scope.leave;
        userService.callService($scope, '/updateLeave').then(function (response) {
            //$.skylo('end');
            $scope.showProgress = false;
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
    $scope.showProgress = false;
    $scope.dataObj = {};
    $scope.user = JSON.parse(localStorage.erpUser);

    /*$.skylo({
        state: 'success',
        inchSpeed: 200,
        initialBurst: 30,
        flat: false
    });*/


    $scope.getAllLeaveTypes = function () {
        $scope.showProgress = true;
        $scope.dataObj.user = $scope.user;
        userService.callService($scope, "/getAllLeaveTypes").then(function (response) {
            //$.skylo('end');
            $scope.showProgress = false;
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
        $scope.showProgress = true;
        $scope.leave.appliedBy = $scope.user;
        $scope.dataObj.leave = $scope.leave;
        userService.callService($scope, "/applyLeave").then(function (response) {
            //$.skylo('end');
            $scope.showProgress = false;
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
    $scope.showProgress = false;
    $scope.dataObj = {};
    $scope.user = JSON.parse(localStorage.erpUser);

    /*$.skylo({
        state: 'success',
        inchSpeed: 200,
        initialBurst: 30,
        flat: false
    });*/


    $scope.getAllLeaveTypes = function () {
        $scope.showProgress = true;
        $scope.dataObj.user = $scope.user;
        $scope.dataObj.requestType = "ALL";
        userService.callService($scope, '/getAllLeaveTypes').then(function (response) {
            //$.skylo('end');
            $scope.showProgress = false;
            $scope.response = response;
            userService.showResponse($scope,"");
            $scope.leaveTypes = response.company.leaveTypes;
            //console.log(response.user.company);

        });
    }

    $scope.addLeavePolicy = function () {
        //console.log("Scope :" + $scope.user.company + " actual " + JSON.stringify($scope.leaveTypes));
        //$scope.user.company.leavePolicy = $scope.company.leavePolicy;
        $scope.showProgress = true;
        $scope.user.company.leaveTypes = $scope.leaveTypes;
        $scope.dataObj.user = $scope.user;
        userService.callService($scope, '/addLeavePolicy').then(function (response) {
            //$.skylo('end');
            $scope.showProgress = false;
            $scope.response = response;
            userService.showResponse($scope, "Leave policy updated!");
        });
    }

    $scope.getAllLeaveTypes();


});