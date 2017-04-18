function getTodaysDate() {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!

    var yyyy = today.getFullYear();
    if (dd < 10) {
        dd = '0' + dd;
    }
    if (mm < 10) {
        mm = '0' + mm;
    }
    var today = yyyy + '-' + mm + '-' + dd;
    return today;
}

angular.module("app").controller('projects', function ($scope, userService, $location, Upload) {

    $scope.response = {};
    $scope.dataObj = {};
    console.log("Projects loaded ..");


    $scope.user = JSON.parse(localStorage.erpUser);

    $scope.getAllUserProjects = function () {
        userService.showLoading($scope);
        $scope.dataObj.user = $scope.user;
        userService.callService($scope, "/getAllUserProjects", "P").then(function (response) {

            userService.initLoader($scope);
            $scope.response = response;
            userService.showResponse($scope, "");
            if ($scope.response == null || $scope.response.status != 200) {
                return;
            }
            $scope.projects = response.projects;
            localStorage.erpUser = JSON.stringify($scope.user);

        });
    }

    $scope.addNew = function () {
        $scope.user.currentProject = null;
        $scope.user.currentRecord = null;
        localStorage.erpUser = JSON.stringify($scope.user);
        window.location.href = "#myProject"
    }

    $scope.selectProject = function (project) {
        $scope.user.currentProject = project;
        localStorage.erpUser = JSON.stringify($scope.user);
        window.location.href = "#projectDetails";
    }

    $scope.getAllUserProjects();


});

angular.module("app").controller('updateProject', function ($scope, userService, $location) {

    $scope.response = {};
    $scope.dataObj = {};
    console.log("Update Project loaded ..");



    $scope.user = JSON.parse(localStorage.erpUser);



    $scope.getProject = function () {
        userService.showLoading($scope);
        $scope.dataObj.user = $scope.user;
        userService.callService($scope, "/getProject", "P").then(function (response) {

            userService.initLoader($scope);
            $scope.response = response;
            userService.showResponse($scope, "");
            if ($scope.response == null || $scope.response.status != 200) {
                return;
            }
            $scope.user = response.user;
            localStorage.erpUser = JSON.stringify($scope.user);

        });
    }

    $scope.getAllUsers = function () {
        userService.showLoading($scope);
        $scope.dataObj.user = $scope.user;
        userService.callService($scope, "/getAllCompanyLogins", "P").then(function (response) {

            userService.initLoader($scope);
            $scope.response = response;
            userService.showResponse($scope, "");
            if ($scope.response == null || $scope.response.status != 200) {
                return;
            }
            $scope.users = response.users;
        });
    }

    $scope.close = function () {
        userService.close("#projectDetails");
    }

    $scope.save = function () {
        userService.showLoading($scope);
        $scope.dataObj.user = $scope.user;
        userService.callService($scope, "/createProject", "P").then(function (response) {

            userService.initLoader($scope);
            $scope.response = response;
            userService.showResponse($scope, "Project created successfully!");


        });
    }

    $scope.add = function () {
        $scope.user.currentProject.users.push($scope.selectedUser);

        var index = $scope.users.indexOf($scope.selectedUser);
        $scope.users.splice($scope.selectedUser, 1);
    }

    $scope.remove = function (user) {
        console.log(user.name)
        $scope.users.push(user);

        var index = $scope.user.currentProject.users.indexOf(user);
        $scope.user.currentProject.users.splice(user, 1);
    }

    if ($scope.user.currentProject != null && $scope.user.currentProject.id > 0) {
        $scope.getProject();
    } else {
        $scope.user.currentProject = {
            users: []
        };
    }



    $scope.getAllUsers();


});


angular.module("app").controller('projectStructure', function ($scope, userService, $location) {

    $scope.response = {};
    $scope.dataObj = {};
    console.log("Project structure loaded ..");



    $scope.user = JSON.parse(localStorage.erpUser);

    if ($scope.user.currentProject == null || $scope.user.currentProject.id == null) {
        window.location.href = "#myProjects";
        return;
    }


    $scope.getProject = function () {
        userService.showLoading($scope);
        $scope.dataObj.user = $scope.user;
        userService.callService($scope, "/getProject", "P").then(function (response) {

            userService.initLoader($scope);
            $scope.response = response;
            userService.showResponse($scope, "");
            if ($scope.response == null || $scope.response.status != 200) {
                return;
            }
            $scope.user = response.user;
            localStorage.erpUser = JSON.stringify($scope.user);

        });
    }



    $scope.close = function () {
        userService.close("#projectDetails");
    }

    $scope.save = function () {
        userService.showLoading($scope);
        $scope.dataObj.user = $scope.user;
        userService.callService($scope, "/updateProjectStructure", "P").then(function (response) {

            userService.initLoader($scope);
            $scope.response = response;
            userService.showResponse($scope, "Project structure updated successfully!");


        });
    }

    $scope.add = function () {
        var field = {
            type: 'TEXT'
        };
        $scope.user.currentProject.fields.push(field);
    }

    $scope.remove = function (field) {
        var index = $scope.user.currentProject.fields.indexOf(field);
        $scope.user.currentProject.fields.splice(field, 1);
    }

    $scope.getProject();



});


angular.module("app").controller('projectDetails', function ($scope, userService, $location) {

    $scope.response = {};
    $scope.dataObj = {};
    console.log("Project details loaded ..");



    $scope.user = JSON.parse(localStorage.erpUser);


    if ($scope.user.currentProject == null || $scope.user.currentProject.id == null) {
        window.location.href = "#myProjects";
        return;
    }



    $scope.getProject = function () {
        userService.showLoading($scope);
        $scope.dataObj.requestType = "REC";
        $scope.dataObj.user = $scope.user;
        userService.callService($scope, "/getProject", "P").then(function (response) {

            userService.initLoader($scope);
            $scope.response = response;
            userService.showResponse($scope, "");
            if ($scope.response == null || $scope.response.status != 200) {
                return;
            }
            $scope.user = response.user;
            localStorage.erpUser = JSON.stringify($scope.user);

        });
    }

    $scope.addNew = function () {
        console.log($scope.user.currentRecord)
        $scope.user.currentRecord = null;
        localStorage.erpUser = JSON.stringify($scope.user);
        console.log($scope.user.currentRecord)
        window.location.href = "#updateRecord"
    }

    $scope.selectRecord = function (record) {
        $scope.user.currentRecord = record;
        localStorage.erpUser = JSON.stringify($scope.user);
        window.location.href = "#updateRecord"
    }

    $scope.showDelete = function (rec) {
        $scope.user.currentRecord = {
            id: rec.id,
            status: 'D'
        };
        $("#deleteRecord").modal('show');
    }


    $scope.deleteRecord = function () {
        $("#deleteRecord").modal('hide');
        userService.showLoading($scope);
        $scope.dataObj.user = $scope.user;
        userService.callService($scope, "/updateRecord", "P").then(function (response) {
            userService.initLoader($scope);
            $scope.response = response;
            userService.showResponse($scope, "Record deleted successfully!!");
            if ($scope.response == null || $scope.response.status != 200) {
                return;
            }
            $scope.user.currentRecord = null;
        });
    }



    $scope.close = function () {
        userService.close("#projectDetails");
    }


    $scope.getProject();



});


angular.module("app").controller('updateRecord', function ($scope, userService, $location, Upload) {

    $scope.response = {};
    $scope.dataObj = {};
    console.log("Record details loaded ..");

    $scope.rootUrl = projectRoot + "/getFile/";


    $scope.user = JSON.parse(localStorage.erpUser);



    $scope.getRecord = function () {
        userService.showLoading($scope);
        $scope.dataObj.user = $scope.user;
        userService.callService($scope, "/getRecord", "P").then(function (response) {

            userService.initLoader($scope);
            $scope.response = response;
            userService.showResponse($scope, "");
            if ($scope.response == null || $scope.response.status != 200) {
                return;
            }
            $scope.user = response.user;
            $scope.user.currentRecord.recordDate = $scope.user.currentRecord.recordDateString;
            localStorage.erpUser = JSON.stringify($scope.user);

        });
    }
    
     $scope.showDelete = function (file) {
        $scope.user.currentRecord.file = {
            id: file.id,
            fileName: file.fileName
        };
        $("#deleteFile").modal('show');
    }
     
     $scope.deleteFile = function () {
        userService.showLoading($scope);
        $scope.dataObj.user = $scope.user;
        userService.callService($scope, "/deleteFile", "P").then(function (response) {
            $("#deleteFile").modal('hide');
            userService.initLoader($scope);
            $scope.response = response;
            userService.showResponse($scope, "File deleted successfully!!");
            if ($scope.response == null || $scope.response.status != 200) {
                return;
            }
            
        });
    }


    $scope.save = function () {
        userService.showLoading($scope);
        $scope.user.currentRecord.status = "A";
        $scope.dataObj.user = $scope.user;
        userService.callService($scope, "/updateRecord", "P").then(function (response) {

            userService.initLoader($scope);
            $scope.response = response;
            userService.showResponse($scope, "Record updated successfully!!");
            if ($scope.response == null || $scope.response.status != 200) {
                return;
            }
        });
    }

    $scope.upload = function () {
        console.log("In upload!");
        var user = {
            id: $scope.user.id,
            email: $scope.user.email,
            currentRecord: {
                id: $scope.user.currentRecord.id,
                file: {
                    fileName: $scope.fileName
                }
            }
        }
        
        Upload.upload({
            url: projectRoot + '/uploadFile',
            data: {
                file: $scope.file,
                user: JSON.stringify(user)
            }
        }).then(function (resp) {
                userService.showResponse($scope, "File Uploaded successfully!");

            },
            function (resp) {
                console.log('Error status: ' + resp.status);
                $scope.errorMsg = "Error connecting server!";
            },
            function (evt) {
                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                //console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
            });
    }

    $scope.getProject = function () {
        userService.showLoading($scope);
        $scope.dataObj.requestType = "REC";
        $scope.dataObj.user = $scope.user;
        userService.callService($scope, "/getProject", "P").then(function (response) {

            userService.initLoader($scope);
            $scope.response = response;
            userService.showResponse($scope, "");
            if ($scope.response == null || $scope.response.status != 200) {
                return;
            }
            if (response.user.currentProject == null) {
                window.location.href = "#myProjects";
                return;
            }
            $scope.user.currentRecord.values = response.user.currentProject.fields;
            $scope.user.currentRecord.titleField = response.user.currentProject.titleField;
            $scope.user.currentRecord.recordDate = getTodaysDate();
            localStorage.erpUser = JSON.stringify($scope.user);

        });
    }



    $scope.close = function () {
        userService.close("#projectDetails");
    }

    if ($scope.user.currentRecord == null || $scope.user.currentRecord.id == null) {
        console.log("New" + $scope.user.currentProject);
        $scope.user.currentRecord = {

        };
        $scope.getProject();
    } else {
        $scope.getRecord();
    }



});
