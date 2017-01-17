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
        userService.getAllEmployees($scope).then(function (response) {
            //$.skylo('end');
            $scope.showProgress = false;
            if (response == null) {
                $scope.response.responseText = "Error connecting server ..";
                return;
            }
            $scope.employees = response.user.company.employees;
            //console.log(response.user.company);

        });
    }

    $scope.getAllLeaveTypes = function () {
        $scope.showProgress = true;
        $scope.dataObj.user = $scope.user;
        userService.getAllLeaveTypes($scope).then(function (response) {
            //$.skylo('end');
            $scope.showProgress = false;
            if (response == null) {
                $scope.response.responseText = "Error connecting server ..";
                return;
            }
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
        userService.applyLeave($scope).then(function (response) {
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
            $("#myModal").modal('show');
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
        userService.getAllEmployeeLeaves($scope).then(function (response) {
            //$.skylo('end');
            $scope.showProgress = false;
            if (response == null) {
                $scope.response.responseText = "Error connecting server ..";
                return;
            }
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
        userService.getEmployeeLeaves($scope).then(function (response) {
            //$.skylo('end');
            $scope.showProgress = false;
            if (response == null) {
                $scope.response.responseText = "Error connecting server ..";
                return;
            }
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
            if (response == null) {
                $scope.updateLeaveResponse = "Error connecting server ..";
                return;
            }
            if(response.status != 200) {
                $scope.updateLeaveResponse = response.responseText;
                return;
            } else {
                $scope.updateLeaveResponse = "Leave updated successfully!";
            }
            
            $scope.getEmployeeLeaves();
        });
    }

    $scope.getEmployeeLeaves();

});

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


    $scope.getAllLeaveTypes = function () {
        $scope.showProgress = true;
        $scope.dataObj.user = $scope.user;
        userService.getAllLeaveTypes($scope).then(function (response) {
            //$.skylo('end');
            $scope.showProgress = false;
            if (response == null) {
                $scope.response.responseText = "Error connecting server ..";
                return;
            }
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
        userService.applyLeave($scope).then(function (response) {
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
            $("#myModal").modal('show');
            //console.log(response.user.company);

        });
    }

    $scope.getAllLeaveTypes();


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
        userService.getAllLeaveTypes($scope).then(function (response) {
            //$.skylo('end');
            $scope.showProgress = false;
            if (response == null) {
                $scope.response.responseText = "Error connecting server ..";
                return;
            }
            $scope.response.status = response.status;
            if($scope.response.status == 200) {
                $scope.response.responseText = "";
            } else {
                $scope.response.responseText = response.responseText;
            }
            $scope.leaveTypes = response.company.leaveTypes;
            //console.log(response.user.company);

        });
    }

    $scope.addLeavePolicy = function () {
        console.log("Scope :" + $scope.user.company + " actual " + JSON.stringify($scope.leaveTypes));
        //$scope.user.company.leavePolicy = $scope.company.leavePolicy;
        $scope.user.company.leaveTypes = $scope.leaveTypes
        $scope.dataObj.user = $scope.user;
        userService.callService($scope, '/addLeavePolicy').then(function (response) {
            //$.skylo('end');
            $scope.showProgress = false;
            if (response == null) {
                $scope.response.status = -111;
                $scope.response.responseText = "Error connecting server ..";
                return;
            }
            $scope.response.status = response.status;
            if($scope.response.status == 200) {
                $scope.response.responseText = "Leave policy updated!";
            } else {
                $scope.response.responseText = response.responseText;
            }
        });
    }

    $scope.getAllLeaveTypes();


});