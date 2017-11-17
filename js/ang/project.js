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


    $scope.title = "Add New Project";
    $scope.backLink = "#myProjects";

    if ($scope.user.currentProject != null && $scope.user.currentProject.id != null) {
        $scope.title = "Edit Project";
        $scope.backLink = "#projectDetails"
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
        if ($scope.user.currentProject.status == 'D') {
            userService.close("#myProjects");
        } else {
            userService.close("#projectDetails");
        }

    }

    $scope.save = function () {
        userService.showLoading($scope);
        $scope.dataObj.user = $scope.user;
        console.log($scope.user.currentProject.users[0]);
        userService.callService($scope, "/createProject", "P").then(function (response) {

            userService.initLoader($scope);
            $scope.response = response;
            userService.showResponse($scope, "Project updated successfully!");


        });
    }

    $scope.add = function () {
        $scope.selectedUser.rights = {
            recordAccess: true,
            fileAccess: true,
            commentAccess: true
        };
        $scope.user.currentProject.users.push($scope.selectedUser);

        var index = $scope.users.indexOf($scope.selectedUser);
        $scope.users.splice(index, 1);
    }

    $scope.remove = function (user) {
        $scope.users.push(user);

        var index = $scope.user.currentProject.users.indexOf(user);
        console.log(user.name + ":" + index);
        $scope.user.currentProject.users.splice(index, 1);
    }

    if ($scope.user.currentProject != null && $scope.user.currentProject.id > 0) {
        $scope.getProject();
    } else {
        $scope.user.currentProject = {
            users: []
        };
    }


    $scope.deleteCurrentProject = function () {
        console.log("Deleting ..");
        userService.showLoading($scope);
        $scope.dataObj.user = $scope.user;
        $scope.user.currentProject.status = 'D';
        userService.callService($scope, "/createProject", "P").then(function (response) {
            userService.initLoader($scope);
            $scope.response = response;
            if ($scope.response == null || $scope.response.status != 200) {
                return;
            }
            $("#deleteProjectModal").modal('hide');
            userService.showResponse($scope, "Project deleted successfully!");
        });
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
        console.log($scope);
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
        $scope.user.currentProject.fields.splice(index, 1);
    }

    $scope.getProject();



});

app.directive('ngEsc', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress keyup", function (event) {
            if (event.which === 27) {
                scope.$apply(function () {
                    scope.$eval(attrs.ngEsc);
                });

                event.preventDefault();
            }
        });
    };
});

angular.module("app").controller('projectDetails', function ($scope, userService, $location, Upload, $routeParams, $http) {

    $scope.response = {};
    $scope.dataObj = {};
    $scope.file = {};
    console.log("Project details loaded ..");

    $scope.requestType = "MONTH";

    $scope.user = JSON.parse(localStorage.erpUser);

    /*alert($routeParams.projectId);*/

    if ($routeParams.projectId != null) {
        $scope.user.currentProject = {
            id: $routeParams.projectId
        }
    }

    if ($scope.user.currentProject == null || $scope.user.currentProject.id == null) {
        window.location.href = "#myProjects";
        return;
    }

    $scope.downloadExcel = function () {
        console.log("Calling .." + projectRoot + "/downloadProjectData");
        $http({
            url: projectRoot + "/downloadProjectData",
            method: "POST",
            data: $scope.user.currentProject, //this is your json data string
            headers: {
                'Content-type': 'application/json'
            },
            responseType: 'arraybuffer'
        }).success(function (data, status, headers, config) {
            var blob = new Blob([data], {
                type: "application/vnd.ms-excel"
            });
            var objectUrl = URL.createObjectURL(blob);
            //window.open(objectUrl);

            var a = document.createElement("a");
            document.body.appendChild(a);
            a.style = "display: none";
            a.href = objectUrl;
            a.download = $scope.user.currentProject.title + ".xls";
            a.click();
            window.URL.revokeObjectURL(url);

        }).error(function (data, status, headers, config) {
            //upload failed
            console.log("Error!!!" + data);
        });
    }

    $scope.user.currentRecord = {};

    $scope.mainDiv = 12;


    $scope.getProject = function () {

        userService.showLoading($scope);
        $scope.dataObj.requestType = $scope.requestType;
        $scope.dataObj.user = $scope.user;
        userService.callService($scope, "/getProject", "P").then(function (response) {

            userService.initLoader($scope);
            $scope.response = response;
            userService.showResponse($scope, "");
            if ($scope.response == null || $scope.response.status != 200) {
                return;
            }
            $scope.user = response.user;
            /*if ($scope.backupRecord != null) {
                $scope.user.currentRecord = $scope.backupRecord;
            }*/
            localStorage.erpUser = JSON.stringify($scope.user);

        });
    }

    /*$scope.getInitials = function (user, bgColor, fontColor) {

        var canvas = document.createElement('canvas');
        canvas.style.display = 'none';
        canvas.width = '30';
        canvas.height = '28';
        document.body.appendChild(canvas);
        var context = canvas.getContext('2d');
        context.fillStyle = bgColor;
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.font = "16px Arial";
        context.fillStyle = fontColor;
        var first, last;
        if (user != null && user.name != null) {
            first = user.name[0];
            var initials = first;
            context.fillText(initials.toUpperCase(), 10, 23);
            //last = name.last && name.last != '' ? name.last[0] : null;
            var data = canvas.toDataURL();
            document.body.removeChild(canvas);
            return data;
        } else {
            return false;
        }
    }*/

    $scope.getInitials = function (user) {
        return user.name[0].toUpperCase();
    }


    $scope.addNew = function () {
        /*console.log($scope.user.currentRecord)
        $scope.user.currentRecord = null;
        localStorage.erpUser = JSON.stringify($scope.user);
        console.log($scope.user.currentRecord)
        window.location.href = "#updateRecord"*/
        $scope.mainDiv = 8;
        $scope.tab = 1;
        $scope.user.currentRecord = {
            id: 0
        };
        $scope.user.currentRecord.values = $scope.user.currentProject.fields;
        $scope.user.currentRecord.titleField = $scope.user.currentProject.titleField;
        $scope.user.currentRecord.recordDate = getTodaysDate();
        $scope.user.currentProject.records.unshift($scope.user.currentRecord);
    }

    $scope.selectRecord = function (record, tab) {

        if ($scope.user.currentRecord.id == null || $scope.user.currentRecord.id != record.id) {
            if (tab != 1) {
                $scope.getRecord();
            }
            $scope.user.currentRecord = record;
            localStorage.erpUser = JSON.stringify($scope.user);
            $scope.tab = tab;
            $scope.mainDiv = 8;
        } else {
            if (tab != $scope.tab) {
                $scope.tab = tab;
            } else {
                $scope.cancel();
            }
        }
        //window.location.href = "#updateRecord"
    }

    $scope.cancel = function () {
        if ($scope.user.currentRecord.id == 0) {
            $scope.user.currentProject.records.shift();
        }
        $scope.user.currentRecord = {};
        $scope.mainDiv = 12;
    }

    $scope.showDeleteRecord = function (rec) {
        console.log("Deleteing record .." + rec);
        $scope.deleteRecord = rec;
        //$scope.user.currentRecord = $scope.deleteRecord;
        $scope.deleteRecord.status = 'D';
        $("#deleteRecord").modal('show');

    };

    $scope.deleteCurrentRecord = function () {
        $("#deleteRecord").modal('hide');
        userService.showLoading($scope);
        $scope.dataObj.user = $scope.user;
        $scope.dataObj.user.currentRecord = $scope.deleteRecord;
        userService.callService($scope, "/updateRecord", "P").then(function (response) {
            userService.initLoader($scope);
            $scope.response = response;
            userService.showResponse($scope, "Record deleted successfully!!");
            if ($scope.response == null || $scope.response.status != 200) {
                return;
            }
            var index = $scope.user.currentProject.records.indexOf($scope.deleteRecord);
            $scope.user.currentProject.records.splice(index, 1);
            $scope.cancel();
            $scope.deleteRecord = null;
        });
    };

    /*$scope.showDelete = function (file) {
        $scope.user.currentRecord.file = {
            id: file.id,
            fileName: file.fileName
        };
        $("#deleteFile").modal('show');
    }*/

    $scope.deleteFile = function (file) {
        $scope.user.currentRecord.file = {
            id: file.id,
            fileName: file.fileName
        };
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
            var index = $scope.user.currentRecord.files.indexOf($scope.user.currentRecord.file);
            $scope.user.currentRecord.files.splice(index, 1);
            $scope.user.currentRecord.fileCount = $scope.user.currentRecord.files.length;
            updateFileComments();

        });
    }

    function updateRecordComments() {
        var i = 0;
        for (i = 0; i < $scope.user.currentProject.records.length; i++) {
            if ($scope.user.currentProject.records[i].id == $scope.user.currentRecord.id) {
                $scope.user.currentProject.records[i].comments = $scope.user.currentRecord.comments;
                $scope.user.currentProject.records[i].commentCount = $scope.user.currentRecord.commentCount;
                console.log("Updated comment!!");
            }
        }
    }

    $scope.addComment = function () {
        if ($scope.user.currentRecord.comment.comment == null) {
            return;
        }
        userService.showLoading($scope);
        /*$scope.user.currentRecord.comment = {
            comment: $scope.currentComment
        }*/
        $scope.dataObj.user = $scope.user;
        console.log($scope.dataObj);
        userService.callService($scope, "/updateComment", "P").then(function (response) {
            userService.initLoader($scope);
            $scope.response = response;
            userService.showResponse($scope, "Comment added successfully!!");
            if ($scope.response == null || $scope.response.status != 200) {
                return;
            }

            $scope.user.currentRecord.comments.push(response.user.currentRecord.comment);
            //$scope.$apply();
            $scope.user.currentRecord.commentCount = $scope.user.currentRecord.comments.length;
            console.log("Comments length:" + $scope.user.currentRecord.comments.length + ":" + $scope.user.currentRecord.commentCount);
            updateRecordComments();

        });
    }

    $scope.removeComment = function (comment) {
        $scope.user.currentRecord.comment = {
            id: comment.id
        }
        $scope.dataObj.user = $scope.user;
        userService.showLoading($scope);
        userService.callService($scope, "/updateComment", "P").then(function (response) {
            userService.initLoader($scope);
            $scope.response = response;
            userService.showResponse($scope, "Comment deleted successfully!!");
            if ($scope.response == null || $scope.response.status != 200) {
                return;
            }

            var index = $scope.user.currentRecord.comments.indexOf(comment);
            $scope.user.currentRecord.comments.splice(index, 1);
            $scope.user.currentRecord.commentCount = $scope.user.currentRecord.comments.length;
            updateRecordComments();
        });
    };

    function updateFileComments() {
        var i = 0;
        for (i = 0; i < $scope.user.currentProject.records.length; i++) {
            if ($scope.user.currentProject.records[i].id == $scope.user.currentRecord.id) {
                $scope.user.currentProject.records[i].files = $scope.user.currentRecord.files;
                $scope.user.currentProject.records[i].fileCount = $scope.user.currentRecord.fileCount;
                console.log("Updated file!!");
            }
        }
    }


    $scope.upload = function () {
        console.log($scope.user.currentRecord.file);
        var user = {
            id: $scope.user.id,
            email: $scope.user.email,
            currentRecord: {
                id: $scope.user.currentRecord.id,
                file: {
                    fileName: $scope.user.currentRecord.file.fileName
                },
                titleField: $scope.user.currentRecord.titleField
            }
        }

        Upload.upload({
            url: projectRoot + '/uploadFile',
            data: {
                file: $scope.user.currentRecord.file,
                user: JSON.stringify(user)
            }
        }).then(function (resp) {
                userService.showResponse($scope, "File Uploaded successfully!");
                $scope.user.currentRecord.files.push(response.user.currentRecord.file);
                $scope.user.currentRecord.fileCount = $scope.user.currentRecord.files.length;
                updateFileComments();
            },
            function (resp) {
                console.log('Error status: ' + resp.status);
                $scope.errorMsg = "Error connecting server!";
            },
            function (evt) {
                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                //console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
            });
    };





    $scope.filterRecords = function (record) {
        if ($scope.keywords == null || $scope.keywords.length == 0) {
            return true;
        }
        var i = 0;
        var j = 0;
        var result = false;
        for (i = 0; i < $scope.keywords.length; i++) {
            result = false;
            if ($scope.keywords[i].text.charAt(0) == '@') {
                //Match users only
                /*if (record.createdUser == null || !matchValue(record.createdUser.name, $scope.keywords[i].text)) {
                    result = false;
                }*/
                if (record.assignedUser != null && matchValue(record.assignedUser.name, $scope.keywords[i].text.substring(1, $scope.keywords[i].text.length - 1))) {
                    result = true;
                }
            } else if (matchValue(record.titleField.value, $scope.keywords[i].text)) {
                result = true;
            } else {
                for (j = 0; j < record.values.length; j++) {
                    if (matchValue(record.values[j].value, $scope.keywords[i].text)) {
                        result = true;
                        //console.log("True!!");
                    }
                }
            }
            if (!result) {
                return false;
            }
        }

        return true;
    };

    $scope.isFollowUp = function (rec) {
        if (!rec.followUp) {
            return false;
        }
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth() + 1; //January is 0!
        var yyyy = today.getFullYear();
        var dateString = yyyy + "-" + mm + "-" + dd;
        if (dateString != rec.recordDateString) {
            console.log("False!!" + dateString + " != " + rec.recordDateString);
            return false;
        }
        return true;
    }

    function matchValue(value, search) {
        if (search == null) {
            return true;
        }
        if (value == null) {
            return false;
        }
        if (value.toLowerCase().indexOf(search.toLowerCase()) != -1) {
            return true;
        }
        return false;
    }

    $scope.close = function () {
        userService.close();
        //$scope.ca

    }


    $scope.save = function () {
        if ($scope.user.currentRecord.id == 0) {
            $scope.user.currentRecord.id = null;
        }
        try {
            $scope.backupRecord = angular.copy($scope.user.currentRecord, $scope.backupRecord);
        } catch (e) {
            console.log("Error:" + e);
        }
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
            if ($scope.user.currentRecord.id == null) {
                $scope.cancel();
            }
            $scope.getProject();
        });
    }

    $scope.fieldClass = function (field) {
        if (field.maxLength) {
            return "panel-body";
        }
        return "panel-body field_value";
    }

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



    $scope.getProject();



});


angular.module("app").controller('projectMails', function ($scope, userService, $location, $routeParams) {

    $scope.response = {};
    $scope.dataObj = {};
    console.log("Project mail settings loaded .." + localStorage.erpUser);



    $scope.user = JSON.parse(localStorage.erpUser);

    if ($routeParams.projectId != null) {
        $scope.user.currentProject = {
            id: $routeParams.projectId
        }
    }

    if ($scope.user.currentProject == null || $scope.user.currentProject.id == null) {
        window.location.href = "#myProjects";
        return;
    }


    $scope.close = function () {
        userService.close("#projectDetails");
    }

    $scope.save = function () {
        $scope.dataObj.user = $scope.user;
        console.log($scope);
        userService.callService($scope, "/updateMailSettings", "P").then(function (response) {
            $scope.response = response;
            if (response == null || response.status != 200) {
                return;
            }
            userService.showResponse($scope, "Mail settings updated successfully!");
        });
    }

    function getMailSettings() {
        $scope.dataObj.user = $scope.user;
        userService.callService($scope, "/getMailSettings", "P").then(function (response) {
            if (response == null || response.status != 200) {
                return;
            }
            $scope.user.currentProject.mailConfig = response.user.currentProject.mailConfig;

        });
    }

    getMailSettings();

});
