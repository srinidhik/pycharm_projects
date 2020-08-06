/**
 * Created by Sanjay on 24/5/17.
 */
    function deleteAllCookies() {
    var cookies = document.cookie.split(";");

    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        var eqPos = cookie.indexOf("=");
        var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
}
 deleteAllCookies();

var cfDirectives = angular.module("cf.directives", []);

cfDirectives.directive('cfAssignTask', [function () {
    return {
        restrict: 'EA',
        scope: {},
        templateUrl: 'assignTask.html',
        controller: ["$scope", "employeeData", "$http",  function ($scope, EmployeeData,$http) {
            $scope.abc = function () {
                return true;

            };
            $scope.dtmax = formatDate( new Date());
            $scope.newFormatDate = {
                "startTime": new Date(1970, 0, 1,10,0,0),"endTime": new Date(1970, 0, 1, 12, 0, 0)
            };
            $scope.printData = function(){
              //console.log($scope.newEndTime , "ME andYOU",$scope.newStartTime)
            };
            //console.log(JSON.parse(employeeData.employeeProjectsDetails));
//            employeeData = JSON.parse(employeeData);
            function jsonParser(data) {
                data = JSON.parse(data);
                return data

            }

            $scope.getTimeFromUtc = function(time){
                if (time) {
                    var hours = (new Date(time)).getHours();
                    var miniutes =  (new Date(time)).getMinutes();
                    var tzone;
                    if (hours >=12) {
                        tzone = 'PM';

                    }
                    else
                        tzone = 'AM';
                    if (hours>12)
                        hours = hours -12;
                    if (miniutes <9 )
                        miniutes = '0' + miniutes;
                    return hours + ' :' + miniutes + tzone
                }
                else
                    return false;
            };

            $scope.getTaskOptions = function(){

            };
            $scope.reverse = true;
            $scope.sortBy = function(propertyName) {
            $scope.reverse = ($scope.propertyName === propertyName) ? !$scope.reverse : false;
            $scope.propertyName = propertyName;
            };


            function getProjectName() {
                $scope.projects = ["Select Project"];
                for (name in x = jsonParser(employeeData.activeProject)) {
                    $scope.projects.push(x[name].fields.projectName)

                }
                $scope.tasks =  $scope.getTaskName();
                $scope.getTaskOptions();
                return $scope.projects;
            }

            $scope.getTaskName = function() {
                $scope.tasks = [];
                for (tk in x = jsonParser(employeeData.activeTask)) {
                    if (x[tk].fields.projectName  == $scope.projectName){
                        $scope.tasks = x[tk].fields.task
                    }
                }

                $scope.taskName = $scope.tasks[0];
                $scope.getTaskOptions();
                return $scope.tasks
            };




            function getTeamName() {
                $scope.teams = [];
                for (team in x = jsonParser(employeeData.activeTeams)) {
                    $scope.teams.push(x[team].fields.teamName)
                }
                return $scope.teams;
            }

            $scope.projects = getProjectName();
            $scope.projectName = $scope.projects[1];
            $scope.teams = getTeamName();
            $scope.tasks = $scope.getTaskName();
            $scope.isAssignTask = true;

            $scope.minutes = ["00","05", 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];
            $scope.hoursZ = ["9 AM", "10 AM", " 11 AM", "00 PM", "01 PM", "02 PM", "03 PM", "04 PM", "05 PM", "06 PM", "07 PM"];
            $scope.hours = ["00", "01", "02", "03", "04", "05", "06", "07","08","09", "10", "11", "12","13","14","15","16","17","18","19","20","21","22","23",];

            $scope.assignTask = function () {
                if ($scope.isAssignTask == false) {
                    $scope.currentFilterProject = 'ALL';
                    $scope.isAssignTask = true;
                    $scope.isPreviousDetails = false;
                    $scope.projects[0] = "Select Project";

                    //$scope.getTaskName();
                }

            };
            function getNewStartTime(time){
                var time_var = new Date();
                time_var.setHours(parseInt($scope.startHour));
                time_var.setMinutes(parseInt($scope.startMinute));
                $scope.newStartTime = time_var;
                return time_var
            }
             function getNewEndTime(time){
                var time_var = new Date();
                time_var.setHours(parseInt($scope.endHour));
                time_var.setMinutes(parseInt($scope.endMinute));
                 $scope.newEndTime = time_var;
                return time_var
            }
            function getFormatedDate(date){
                if (date.match(/[^0-9]/g)) {
                date = date.replace(/[^0-9^-]/g, '');
            }
                return date;
            }

            $scope.EmployeeSelectedProject = function () {
                var selectedData = {
                    "projectName": $scope.projectName,
                    "taskName": $scope.taskName,
                    "teamName": $scope.teamName,
                    "startDate": getFormatedDate($scope.startDate),
                    "endDate": $scope.endDate,
                    "startHour": $scope.startHour,
                    "endHour": $scope.endHour,
                    "startMinute": $scope.startMinute,
                    "endMinute": $scope.endMinute,
                    "startTimeZ": $scope.startTimeZ,
                    "endTimeZ": $scope.endTimeZ,
                    "description":$scope.description || "-",
                    "taskOption":$scope.taskOption || "Others",
                    "userEmail":$scope.userEmail || '',
                    "newStartTime":getNewStartTime($scope.newStartTime),
                    "newEndTime":getNewEndTime($scope.newEndTime)
                };
                return selectedData;
            };

            $scope.setTaskOptions = function(){
                $scope.taskOptions = employeeData.taskOptions[0].fields.taskOption;
                if ($scope.taskOptions[0]) {
                    $scope.taskOption = '';
                    $scope.taskOptions.push({'name':'Others'});
                }

            };
            //$scope.taskOptions = ["SELECT ME"];


            $scope.getTaskOptions = function(){
                var data = $scope.EmployeeSelectedProject();
                if (data) {
                    ajaxindicatorstart(".....");
                    $http({
                        url:"/api/set-task-option" ,
                        dataType: 'json',
                        method : 'GET',
                        params: data,
                        headers: {
                        "Content-Type": "application/json"
                    }

                }).then(function (resp) {
                        if(jsonParser(resp.data).length) {
                            employeeData.taskOptions = (jsonParser(resp.data));
                            $scope.setTaskOptions();
                        }
                        else
                            $scope.taskOptions = {};

                                ajaxindicatorstop();

                            });

                    }
                else {
                    alert("Invalid Data");
                }

            };
            $scope.isAdmin = function() {
                //window.kustome.myAccount.setAccountMail();
                if (window.kustome.myAccount.accountMail == "admin@admin.com")
                    return true;
                else
                    return false;
            };
            $scope.isAdmin();
            $scope.getDuration = function(startTime, endTime){
                var startTime = startTime;
                var endTime = endTime;
                var startHours =  parseInt(startTime.split('T')[0]);
                var endHours = parseInt(endTime.split('T')[0]);
                var startMinits = parseInt((startTime.split('T')[1].replace("AM","")).replace("PM",""));
                var endMiniutes = parseInt((endTime.split('T')[1].replace("AM","")).replace("PM",""));
                var hours = 0;
                if ((startTime.indexOf("AM") !=-1) && (endTime.indexOf("AM") !=-1)){
                    hours = endHours - startHours;

                }
                else if ((startTime.indexOf("PM") !=-1) && (endTime.indexOf("PM") !=-1)){
                    hours = endHours - startHours
                }
                else if((startTime.indexOf("AM") !=-1) && (endTime.indexOf("PM") !=-1)){
                    hours = 12 - startHours + endHours;


                }
                else if((startTime.indexOf("PM") !=-1) && (endTime.indexOf("AM") !=-1)){
                    hours = -1;
                }
                var miniutes = 0;
                if(startMinits <= endMiniutes){
                    miniutes = endMiniutes -startMinits;
                }
                else{
                    miniutes = endMiniutes + 60 -startMinits;
                    hours = hours -1;
                }

                var duration = {"hours":hours,"miniutes":miniutes};
                return duration;
            };

             function validateTime(data){
                 if(data == undefined){
                     return false;
                 }

               var  start_time = new Date(data.newStartTime).getTime();
               var  end_time = new Date(data.newEndTime).getTime();
                if (start_time>= end_time || isNaN(start_time) || isNaN(end_time) ){
                    return false;
                }
                else
                    return true;

            }




            $scope.saveEmployeeProject = function () {
                var data = $scope.EmployeeSelectedProject();

                if ((validateTime(data))) {
                    ajaxindicatorstart(".....");
                    $http.post("/staff/", {'data': data})
                        .then(function (resp) {
                            $scope.serverResponse = resp;
                            $("#errors").text(resp.data.data);

                            $("#errors").css('color',"green");
                            $("#errors").show().delay(3000).fadeOut();
                             employeeData.employeeProjectsDetails = resp.data.employeeProjectsDetails;
                             $scope.filterTaskByDate();
                              $scope.startHour = $scope.endHour ;
                        $scope.endHour = "18";
                        $scope.startMinute =  $scope.endMinute ;
                        $scope.endMinute = '00';
                        $scope.startTimeZ = "AM";
                        $scope.endTimeZ = "AM";
                        $scope.description = "" ;
                            ajaxindicatorstop();
                            //$http.get("/api/staff/");


                        });
                     //window.location.reload();
                }
                else {
                    alert("Start time can not be greater then end time !");
                }

            };

             setTimeout(function () {
                        $scope.getTaskOptions();
                    }, 3000);



            $scope.isPreviousDetails = false;
            $scope.showEmployeeDetails = function(){

                $scope.isPreviousDetails = true;
                 $scope.projects[0] = "ALL";
                $scope.currentFilterProject = "ALL";

                $scope.isAssignTask = false;
            };
            $scope.previousProjects = [];

            function formatDate(date) {
            var d = new Date(date),
                    month = '' + (d.getMonth() + 1),
                    day = '' + d.getDate(),
                    year = d.getFullYear();

                if (month.length < 2) month = '0' + month;
                if (day.length < 2) day = '0' + day;

                return [year, month, day].join('-');
            }
            $scope.sDate = $scope.dtmax;

            $scope.filterTaskByDate = function(){

                $scope.currentFilterProject = $scope.projects[0];
                $scope.isShowProjectColumn = true;
                if($scope.previousProjects !== undefined)
                    $scope.previousProjects.splice(0, $scope.previousProjects.length);
                else
                    return;
                var previousDetails = jsonParser(employeeData.employeeProjectsDetails);
                if (previousDetails.length == 0)
                    return;
                previousDetails = previousDetails[0].fields;
                previousDetails = previousDetails.selectedProject;
                var startDate = ($scope.sDate);

                for(prevD in previousDetails){
                    if (previousDetails[prevD].startDate !== undefined) {

                        if (previousDetails[prevD].startDate.split('T')[0] == startDate ) {
                            if(previousDetails[prevD].isDelete != undefined && previousDetails[prevD].isDelete != true )
                                $scope.previousProjects.push(previousDetails[prevD]);
                             else if (previousDetails[prevD].isDelete == undefined)
                                    $scope.previousProjects.push(previousDetails[prevD][0])
                        }
                    }
                    else{
                        if (previousDetails[prevD][0].startDate.split('T')[0] == startDate) {
                            if(previousDetails[prevD][0].isDelete != undefined && previousDetails[prevD][0].isDelete != true )
                                    $scope.previousProjects.push(previousDetails[prevD][0]);
                            else if (previousDetails[prevD][0].isDelete == undefined)
                                    $scope.previousProjects.push(previousDetails[prevD][0]);


                        }

                    }
                }
                return $scope.previousProjects;
                //console.log($scope.previousProjects);
            };
            $scope.previousProjects = $scope.filterTaskByDate();

            $scope.filterByProject = function(){
                $scope.isShowProjectColumn = false;
                previousDetails = $scope.previousProjects;
                var startDate = ($scope.sDate);
                if($scope.currentFilterProject == "ALL" || $scope.currentFilterProject== null )
                {
                    return $scope.filterTaskByDate();

                }
                for(prevD in previousDetails){
                    if (previousDetails[prevD].projectName != undefined) {
                        if (previousDetails[prevD].projectName != $scope.currentFilterProject) {
                            $scope.previousProjects.splice( $scope.previousProjects.indexOf(previousDetails[prevD]),1)
                        }
                    }
                    else{
                        if (previousDetails[prevD][0].projectName == $scope.currentFilterProject) {
                            $scope.previousProjects.splice( $scope.previousProjects.indexOf(previousDetails[prevD][0]),1)
                        }

                    }
                }
                return $scope.previousProjects;
                //console.log($scope.previousProjects);
            };
            $scope.getTimeDuration = function(startTime, endTime){
                var startHours = (new Date(startTime)).getHours();
                var startMinute = (new Date(startTime)).getMinutes();
                var endHours = (new Date(endTime)).getHours();
                var endminutes = (new Date(endTime)).getMinutes();
                return {"hours" : endHours - startHours, "minutes": endminutes - startMinute}
            }
            $scope.getTotalTime = function(){
              var time = 0;
             var  hours = 0;
                var minutes = 0;
                var startTime =0
                var endTime =0;
                for(details in $scope.previousProjects){
                    startTime = $scope.previousProjects[details].newStartTime;
                    endTime = $scope.previousProjects[details].newEndTime;
                    time = $scope.getTimeDuration(startTime,endTime)
                    if(time.minutes <0){
                        time['hours'] -= 1;
                        time['minutes'] += 60;
                    }
                    hours += time.hours;
                    minutes += time.minutes;

                }
                var ex_hours = 0;
                if (minutes>=60){
                    ex_hours = parseInt(minutes / 60);
                    minutes = minutes % 60;

                }
                return {"hours" : hours + ex_hours, "minutes": minutes}

            };



             $scope.deletePreviousTask = function(prevSelectedTask,index) {
                 var data = prevSelectedTask;
                 if (confirm("Do you want to Delete this Task " )) {
                     ajaxindicatorstart(".....");
                     $http({
                         url: "/staff/",
                         dataType: 'json',
                         method: 'delete',
                         data: data,
                         headers: {
                             "Content-Type": "application/json"
                         }

                     }).then(function (resp) {
                         if (resp.status == 200)
                            alert(resp.data.data);
                         $scope.previousProjects.splice(index,1);
                         employeeData.employeeProjectsDetails = resp.data.employeeProjectsDetails;
                            ajaxindicatorstop();
                     })
                 }
             }

        }]
    }
}]);


cfDirectives.directive('cfReviewProject', [function () {
    return {
        restrict: 'E',
        scope: {},
        templateUrl: 'projectDetails.html',
        controller: ["$scope", "employeeData", "$http", function ($scope, EmployeeData, $http) {

            $scope.callToServer = function (methodName, url, data) {
                ajaxindicatorstart(".....");
                $http({
                    url: url,
                    dataType: 'json',
                    method: methodName,
                    data: data,
                    params: data,
                    headers: {
                        "Content-Type": "application/json"
                    }

                }).then(function (resp) {
                    if (resp.status == 200) {
                        $scope.employeeDetails = resp.data.data;
                        $scope.allEmployeeDetails = resp.data.data;
                        $scope.currentFilterProject = 'ALL';
                        $scope.currentFilterEmail = 'ALL';
                    }


                    ajaxindicatorstop();
                })
                ajaxindicatorstop();
            };
            function jsonParser(data) {
                data = JSON.parse(data);
                return data

            }

            //console.log(employeeData);
            function getProjectName() {
                $scope.projects = ["ALL"];
                for (name in x = jsonParser(employeeData.activeProject)) {
                    $scope.projects.push(x[name].fields.projectName)

                }

                return $scope.projects;
            }

            getProjectName();
            $scope.employeeEmails = [];
            if (employeeData.employeeEmails !== undefined) {
                $scope.employeeEmails.push('ALL');
                var emails = (JSON.parse(employeeData.employeeEmails))
                for (var i = 0; i < emails.length; i++)
                    $scope.employeeEmails.push(emails[i]);
            }
            $scope.allEmployeeEmails = angular.copy($scope.employeeEmails);
            $scope.setEmployeeDetails = function () {

                $scope.employeeDetails = jsonParser(employeeData.employeeProjectsDetails);
                //console.log($scope.employeeDetails);
                $scope.allEmployeeDetails = $scope.employeeDetails

            };
            $scope.setEmployeeDetails();
            $scope.endDate = (new Date()).toISOString().substring(0, 10);
            var startDate = new Date();
            startDate.setDate(startDate.getDate() - 1);
            $scope.startDate = startDate.toISOString().substring(0, 10);

            $scope.paginationList = [];
            function setPaginationAlphabet() {
                for (i = 0; i < $scope.employeeEmails.length; i += 1) {
                    $scope.paginationList.push($scope.employeeEmails[i][0].toUpperCase())
                }

                $scope.paginationList = $scope.paginationList.filter(function (elem, index, self) {
                    return index == self.indexOf(elem);
                });
            }

            setPaginationAlphabet();


            $scope.filterByEmployeeEmail = function () {
                if ($scope.currentFilterEmail == 'ALL' || !(isNaN($scope.currentFilterEmail))) {
                    $scope.employeeDetails = $scope.allEmployeeDetails;
                    return;
                }
                var x = {};
                for (details in $scope.allEmployeeDetails) {
                    if (details == $scope.currentFilterEmail) {
                        x[details] = $scope.allEmployeeDetails[details]
                        $scope.employeeDetails = x;
                        break;
                        return;
                    }
                }
                 $scope.employeeDetails = x;
                return;



            }

            $scope.filterByProjectName = function () {

                if ($scope.currentFilterProject == 'ALL') {
                    $scope.employeeDetails = $scope.allEmployeeDetails;
                    $scope.employeeEmails = $scope.allEmployeeEmails;
                    return;

                }

                $scope.emp_details = angular.copy($scope.allEmployeeDetails);

                for (name in x = jsonParser(employeeData.activeProject)) {
                    if (x[name].fields.projectName == $scope.currentFilterProject) {
                        $scope.employeeEmails = x[name].fields.usersEmail;
                        $scope.employeeEmails.push('ALL')
                        $scope.currentFilterEmail = 'ALL';
                        break;
                    }

                }

                for (details in $scope.emp_details) {
                    for (var detail = 0; detail < $scope.emp_details[details].taskList.length; detail += 1) {
                        if ($scope.emp_details[details].taskList[detail].project !== $scope.currentFilterProject) {
                            $scope.emp_details[details].taskList.splice(detail, 1);
                            detail -= 1;
                        }
                    }
                }
                $scope.employeeDetails = $scope.emp_details;

            }
            $scope.paginationFilter = function(val, index){
                 var x = {};
                if (val == 'ALL'){
                    $scope.employeeDetails  = $scope.allEmployeeDetails;
                    $scope.selectedIndex = index;
                    return;
                }
                 $scope.selectedIndex = index;
                for (details in $scope.allEmployeeDetails) {
                    if (details[0] == val.toLowerCase()) {
                        x[details] = $scope.allEmployeeDetails[details]

                    }
                }
                 $scope.employeeDetails = x;

            }
            $scope.dateFilter = function (){
                var data = {};
                data = {"startDate":$scope.startDate,
                    "endDate":$scope.endDate,
                    "isData":true
                };
                var url = '/projects';
                var method = 'get';
                $scope.callToServer(method, url, data);


            }

        }]
    }
}]);


cfDirectives.directive('cfAdminProject', [function () {
    return {
        restrict: 'E',
        scope: {},
        templateUrl: 'addProject.html',
        controller: ["$scope", "employeeData", "$http", function ($scope, EmployeeData, $http) {


            $scope.minutes = [0, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];
            $scope.hoursZ = ["9 AM", "10 AM", " 11 AM", "00 PM", "01 PM", "02 PM", "03 PM", "04 PM", "05 PM", "06 PM", "07 PM"];
            $scope.hours = ["09", "10", "11", "00", "01", "02", "03", "04", "05", "06", "07","08"];

            $scope.previousProjects = [];
            $scope.currentProject = '';
            $scope.newTeamName = '';
             $scope.isTask = false;
             $scope.isProject = false;
            $scope.isAddNewTask = false;
            $scope.getTaskOptions = function(){

            };
             $scope.getLocalTime = function(time){
                 if (time) {
                    var hours = (new Date(time)).getHours();
                    var miniutes =  (new Date(time)).getMinutes();
                    var tzone;
                    if((isNaN(hours)))
                        return "00:00";
                    if (hours >=12) {
                        tzone = 'PM';

                    }
                    else
                        tzone = 'AM';
                    if (hours>12)
                        hours = hours -12;
                    if (miniutes <9 )
                        miniutes = '0' + miniutes;
                    return hours + ':' + miniutes + tzone
                }
                else
                    return false;
            };

            $scope.reverse = true;
            $scope.sortBy = function(propertyName) {
            $scope.reverse = ($scope.propertyName === propertyName) ? !$scope.reverse : false;
            $scope.propertyName = propertyName;
            };

            $scope.projectModel = function() {

                var projects =  [
                    {
                        "name": $scope.currentProject,
                        "newProjectName": $scope.currentNewProject,
                        "tasks": $scope.tasks,
                        "taskName": $scope.taskName,
                        "startDate": $scope.startDate,
                        "endDate": $scope.endDate,
                        "isTask": $scope.isTask,
                        "isProject": $scope.isProject,
                        "newTaskName": $scope.newTaskName,
                        "isAddNewTask": $scope.isAddNewTask,
                        "taskType": $scope.taskType,
                        "taskOptions": $scope.taskOptions,
                        "currentOption":$scope.Option ||"-",
                        "employeeProjectEmails":$scope.employeeProjectEmails
                    }

                ];
                return projects
            };

            function jsonParser(data) {
                data = JSON.parse(data);
                return data;

            }
            $scope.setEmployeeProjectEmails = function(){
                var current_project = $scope.currentProject;
                var email = '';
                var emails = [];
                for(var k=0;k<$scope.projectDetails.length;k++){
                    if(current_project === $scope.projectDetails[k].name){
                        emails = $scope.projectDetails[k].emails;
                        for(var i=0;i<$scope.employeeProjectEmails.length;i++){
                            if(emails.length<1){
                                $scope.employeeProjectEmails[i].isChecked = false;
                            }
                            for(var j=0;j<emails.length;j++){
                                if($scope.employeeProjectEmails[i].email == emails[j]){
                                    $scope.employeeProjectEmails[i].isChecked = true;
                                    { break; }
                                }
                                else
                                    $scope.employeeProjectEmails[i].isChecked = false;

                            }
                        }
                    }
                }


            };
             $scope.getTaskName = function() {
                $scope.prevTasks = [];
                for (tk in x = JSON.parse(employeeData.activeTask)) {
                    if (x[tk].fields.projectName  == $scope.currentProject){
                        $scope.prevTasks = x[tk].fields.task;
                    }
                }
                  $scope.setProject();
                 $scope.setEmployeeProjectEmails();

                $scope.taskName = $scope.prevTasks[0];
                 $scope.getTaskOptions();
                return $scope.prevTasks
            };
            if(employeeData.employeeEmails !== undefined)
                $scope.employeeProjectEmails = JSON.parse(employeeData.employeeEmails);

            $scope.setProject = function(){
                $scope.projects = ['SELECT PROJECT'];
                $scope.projectDetails = [];
                for (name in x = JSON.parse(employeeData.activeProject)) {
                    $scope.projects.push(x[name].fields.projectName);
                    $scope.projectDetails.push({ "name":x[name].fields.projectName,"emails":x[name].fields.usersEmail});


                }
                //$scope.getTaskName();
                return $scope.projects;

            };
            $scope.projects = $scope.setProject();
            $scope.currentNewProject = $scope.projects[0];
            $scope.currentProject = $scope.projects[0];
            $scope.isAssignTask = false;
            $scope.addNewProject = function () {
                if ($scope.isAssignTask == false) {
                    $scope.isAssignTask = true;
                }
                else
                    $scope.isAssignTask = false;
            };
            $scope.isNewProject = true;
            $scope.newProject = function () {
                //if ($scope.currentProject == "NewProject") {
                    $scope.isNewProject = true;
//                    $scope.projectModel.projects[0].push({newProjectName: $scope.currentNewProject});

                //}
            };
            function get_task() {
                var task = $scope.task;
                return task;
            }
            $scope.tasks = [];
            $scope.prevTasks =  $scope.getTaskName() ;
            $scope.addNewTask = function () {
                $scope.tasks.push({"name":$scope.task,"taskType":$scope.taskType});
            };
            //$scope.tasks.push({"name":$scope.task,"taskType":$scope.taskType});

            $scope.deleteTask = function(i){
                $scope.tasks.splice(i,1)
            };
            $scope.isNewTeam = false;
            //$scope.addNewTeam = function () {
            //    if ($scope.teamName.name.name == "NewTeam") {
            //        $scope.isNewTeam = true;
            //        $scope.projectModel.projects[0].teamNames.push({"teamName": $scope.newTeamName});
            //    }
            //
            //    else
            //        $scope.isNewTeam = false;
            //};

            $scope.isBonitaTask = true;
            $scope.saveProjectDetails = function () {
                var data = $scope.projectModel();
                if (data) {
                    ajaxindicatorstart(".....");
                    if (true) {
                        $http.post("/api/admin/", {'data': data})
                            .then(function (resp) {
                                $scope.serverResponse = resp;
                                $(".submitResponse").text(resp.data);

                                $(".submitResponse").css('color', "green");
                                $(".submitResponse").show().delay(3000).fadeOut();


                                ajaxindicatorstop();

                            });
                        setTimeout(function () {
                            window.location.reload(true);
                        }, 3000);
                    }
                    else
                        return alert("Start time can not be greater than end time !")
                }

            };
                $scope.updateTask = function(){
                    var data = $scope.projectModel();
                    ajaxindicatorstart(".....");
                    $http.put("/api/admin/", {'data': data})
                            .then(function (resp) {
                                $scope.serverResponse = resp;
                                $(".submitResponse").text(resp.data);

                                $(".submitResponse").css('color', "green");
                                $(".submitResponse").show().delay(3000).fadeOut();


                                ajaxindicatorstop();
                                for(var i=0;i<$scope.tasks.length;i++)
                                    $scope.prevTasks.push($scope.tasks[i]);
                                $scope.tasks.splice(0,$scope.tasks.length)
                            });
                        //setTimeout(function () {
                        //    window.location.reload(true);
                        //}, 3000);

                    };



            $scope.showDeleteForm = function (){
                $scope.isNewProject = false;
                $scope.showTaskOption = false;
            };
            $scope.deleteProject = function(){
                $scope.isProject = true;
                 $scope.isTask = false;
                $scope.delete();
            };

            $scope.delete = function(){
                var data = $scope.projectModel();
                var alertStr = "";
                if($scope.isProject == true)
                    alertStr = $scope.currentProject;
                else
                    alertStr = $scope.taskName.name;
                if (confirm("Do you want to Delete " + alertStr)) {
                    ajaxindicatorstart(".....");
                    $http({
                        url:"/api/admin/" ,
                        dataType: 'json',
                        method : 'delete',
                        data : data,
                        headers: {
                        "Content-Type": "application/json"
                    }

                }).then(function (resp) {
                         $(".submitResponse").text(resp.data);

                            $(".submitResponse").css('color',"green");
                            $(".submitResponse").show().delay(3000).fadeOut();


                                ajaxindicatorstop();
                             if($scope.projects && $scope.isTask != true) {
                        $scope.projects.splice($scope.projects.indexOf($scope.currentProject), 1);
                        $scope.currentProject = $scope.projects[0];
                                 $scope.getTaskName();
                    }
                    else if($scope.isTask== true){
                        $scope.prevTasks.splice($scope.prevTasks.indexOf($scope.taskName),1);
                        if($scope.prevTasks)
                            $scope.taskName = $scope.prevTasks[0];
                    }

                            });

                    }
                else {
                    //alert("Invalid Data");
                }

            };
            $scope.put = function(){
                var data = $scope.projectModel();
                if (data) {
                    ajaxindicatorstart(".....");
                    $http({
                        url:"/api/admin/" ,
                        dataType: 'json',
                        method : 'put',
                        data : data,
                        headers: {
                        "Content-Type": "application/json"
                    }

                }).then(function (resp) {
                         $(".submitResponse").text(resp.data);

                            $(".submitResponse").css('color',"green");
                            $(".submitResponse").show().delay(3000).fadeOut();


                                ajaxindicatorstop();

                            });
                    setTimeout(function () {
                        window.location.reload(true);
                    }, 3000);
                    }
                else {
                    alert("Invalid Data!");
                }

            };

            $scope.deleteTasks =  function(){
                $scope.isTask = true;
                $scope.isProject = false;
                $scope.delete()
            };

            $scope.addTaskInPreviousProject = function(){
              $scope.isAddNewTask = true;
                $scope.put();

            };

             $scope.taskOptions = [];
            function getTaskOptionName(){
                var taskOptionName = $scope.taskOption
            }
            $scope.addTaskOptions = function(){
                $scope.taskOptions.push({"name":$scope.taskOptionName})
            };
            $scope.deleteTaskOption = function(i){
                $scope.taskOptions.splice(i,1);
            };

            $scope.submitTaskOptions = function(){
                var data = $scope.projectModel();
                if (data) {
                    ajaxindicatorstart(".....");
                    $http({
                        url:"/api/add-task-option" ,
                        dataType: 'json',
                        method : 'post',
                        data : data,
                        headers: {
                        "Content-Type": "application/json"
                    }

                }).then(function (resp) {
                         $(".submitResponse").text(resp.data);

                            $(".submitResponse").css('color',"green");
                            $(".submitResponse").show().delay(3000).fadeOut();


                                ajaxindicatorstop();
                            if($scope.Options.length<1)
                            {


                            }
                            else{
                                $scope.Options = [];
                            }
                            for(var i=0;i< $scope.taskOptions.length;i++)
                                    $scope.Options.push($scope.taskOptions[i])

                            $scope.taskOptions.splice(0, $scope.taskOptions.length);
                            $scope.Option = $scope.Options[0].name;

                            })

                    }
                else {
                    alert("Invalid data!");
                }


            };
            $scope.showTaskOption  = false;
             $scope.accordianData = [];
            $scope.showTaskOptions = function(){
                $scope.showTaskOption = true;
                $scope.isNewProject = false;
            };

            $scope.filterByProject = function(){
                //var project = $scope.filterByEmail();
                $scope.isShowProjectColumn = true;
                $scope.filterTaskByDate();

                //$scope.sDate = "";
                //$scope.currentFilterEmail = "SELECT EMAIL";
                //$scope.isShowProjectColumn = false;
                //$scope.previousProjects.splice(0, $scope.previousProjects.length);
                //var previousProjectDetails = jsonParser(employeeData.employeeProjectsDetails);
                //if (previousProjectDetails.length <= 0)
                //    return;
                //for (project in previousProjectDetails) {
                //
                //    if( project == '0'){
                //         previousDetails = previousProjectDetails[project].fields;
                //        employeeEmail = previousDetails.email;
                //        previousDetails = previousDetails.selectedProject;
                //
                //    }
                //    else{
                //         previousDetails = previousProjectDetails[project].fields;
                //        employeeEmail = previousDetails.email;
                //        previousDetails = previousDetails.selectedProject;
                //
                //    }
                //
                //    var startDate = ($scope.sDate);
                var range = 0;
                if ($scope.currentFilterProject == "SELECT PROJECT"){
                    return;
                }
                    for (range = 0; range< $scope.previousProjects.length;) {
                            if ($scope.previousProjects[range][0].projectName != $scope.currentFilterProject) {
                                $scope.previousProjects.splice(range,1);
                                range = range -1;
                            }
                        range = range +1

                        }
                 $scope.emoData = $scope.getAcEmail( $scope.paginationProject())


                return $scope.previousProjects;
                //console.log($scope.previousProjects);
            };

            $scope.filterTaskByDate = function(){
                var project  = $scope.filterByEmail();

                //$scope.currentFilterProject = $scope.projects[0];
                $scope.isShowProjectColumn = true;
                //$scope.previousProjects.splice(0, $scope.previousProjects.length);
                //var previousProjectDetails = jsonParser(employeeData.employeeProjectsDetails);
                //if (previousProjectDetails.length == 0)
                //    return;
                //for (project in previousProjectDetails) {
                //
                //    if( project == '0'){
                //        previousDetails = previousProjectDetails[project].fields;
                //        employeeEmail = previousDetails.email;
                //        previousDetails = previousDetails.selectedProject;
                //    }
                //    else{
                //        previousDetails = previousProjectDetails[project].fields;
                //        employeeEmail = previousDetails.email;
                //        previousDetails = previousDetails.selectedProject;
                //    }
                //
                    var startDate = new Date($scope.sDate);
                var toDate =  new Date($scope.toDate);
                var range = 0;
                var currentDate = "";
                    for (range =0; range< $scope.previousProjects.length;){
                        if($scope.previousProjects[range][0].startDate != undefined)
                            currentDate = new Date($scope.previousProjects[range][0].startDate.split('T')[0]);
                        if(+currentDate < +startDate || +toDate < +currentDate){
                            $scope.previousProjects.splice(range,1);
                            range = range -1;
                        }
                        range  = range + 1;

                    }
                 $scope.emoData = $scope.getAcEmail( $scope.paginationProject())

                return $scope.previousProjects;
                //console.log($scope.previousProjects);
            };
            $scope.employeeEmails = ["ALL"];
            function employeeMail() {
                var previousProjectDetails = jsonParser(employeeData.employeeProjectsDetails);
                if (previousProjectDetails.length == 0)
                    return;
                for (project in previousProjectDetails) {
                previousDetails = previousProjectDetails[project].fields;
                employeeEmail = previousDetails.email;
                $scope.employeeEmails.push(employeeEmail)
                }
                return $scope.employeeEmails;
            }
            employeeMail();
            if( $scope.employeeEmails)
                $scope.currentFilterEmail = $scope.employeeEmails[0];



            $scope.filterByEmail = function(){
                var allProject = $scope.allProjectDetails();
                if ($scope.currentFilterEmail == "ALL"){
                    $scope.emoData = $scope.getAcEmail( $scope.paginationProject())
                    return;
                }
                var range = 0;

                    for (range =0;range< $scope.previousProjects.length;) {

                        if ($scope.previousProjects[range][1] !== $scope.currentFilterEmail) {
                            $scope.previousProjects.splice(range, 1);
                            range -=1;
                        }
                        range= range +1;
                    }
                $scope.emoData = $scope.getAcEmail( $scope.paginationProject())

                return $scope.previousProjects;
                //console.log($scope.previousProjects);
            };

            $scope.showProjectDetails = function(){
                if (employeeData.showProjects)
                        return true;
                else
                    return false;
            };
            $scope.manageProjectDetails = false;
            $scope.manageProject = function(){
                $scope.manageProjectDetails = true;


            };
            $scope.addTask = function(){
                 $scope.tasks.push({"name":$scope.task,"taskType":$scope.taskType});
            };

             $scope.setTaskOptions = function(){
                $scope.Options = employeeData.taskOptions[0].fields.taskOption;
                 if($scope.Options[0])
                        $scope.Option = $scope.Options[0].name ||  $scope.Options[0].id + "-" +  $scope.Options[0].customerName;
            };


             $scope.getTaskOptions = function(){
                var data =  $scope.projectModel();
                 delete data[0]['employeeProjectEmails'];



                if (data) {
                    if(data[0].taskName.taskType == "Bonita")
                        $scope.isBonitaTask = false;
                    else
                        $scope.isBonitaTask = true;
                    ajaxindicatorstart(".....");
                    $http({
                        url:"/api/set-task-option" ,
                        dataType: 'json',
                        method : 'GET',
                        params: data[0],
                        headers: {
                        "Content-Type": "application/json"
                    }

                }).then(function (resp) {
                        if(jsonParser(resp.data).length) {
                            employeeData.taskOptions = (jsonParser(resp.data));
                            $scope.setTaskOptions();
                        }
                        else
                            $scope.Options = {};

                                ajaxindicatorstop();

                            });

                    }
                else {
                    alert("Please add atleast one product!");
                }

            };

            $scope.deleteOptions = function() {
                data = $scope.projectModel();
                if ( confirm("Do you want to delete " + $scope.Option)&& data) {
                    ajaxindicatorstart(".....");
                    $http({
                        url: "/api/add-task-option",
                        dataType: 'json',
                        method: 'DELETE',
                        params: data[0],
                        headers: {
                            "Content-Type": "application/json"
                        }

                    }).then(function (resp) {
                         $(".submitResponse").text(resp.data);

                            $(".submitResponse").css('color',"green");
                            $(".submitResponse").show().delay(3000).fadeOut();
                            var ss = {"name":$scope.option};
                            var indexofOption = 0;
                            for (var i=0;i<$scope.Options.length;i++ )
                            {
                                if($scope.Options[i].name == $scope.Option)
                                    indexofOption = i;
                            }

                            $scope.Options.splice( indexofOption ,1);
                            if($scope.Options.length>0)
                                $scope.Option = $scope.Options[0].name;
                         ajaxindicatorstop();



                    });

                }
            };
            $scope.getDuration = function(projectObject){
                if (projectObject.startDate == undefined)
                            projectObject = projectObject[0];
                var startTime = projectObject.startTime;
                var endTime = projectObject.endTime;

                if (startTime != '') {
                    var startMinits = parseInt((startTime.split('T')[1].replace("AM", "")).replace("PM", ""));
                    var endMiniutes = parseInt((endTime.split('T')[1].replace("AM", "")).replace("PM", ""));
                    var startHours =  parseInt(startTime.split('T')[0]);
                    var endHours = parseInt(endTime.split('T')[0]);
                }
                else{
                    var startHours = (new Date(projectObject.newStartTime)).getHours();
                    var endHours = (new Date(projectObject.newEndTime)).getHours();
                    var startMinits = (new Date(projectObject.newStartTime)).getMinutes();
                    var endMiniutes = (new Date(projectObject.newEndTime)).getMinutes() ;

                }
                    var hours = 0;
                if ((startTime.indexOf("AM") !=-1) && (endTime.indexOf("AM") !=-1)){
                    hours = endHours - startHours;

                }
                else if ((startTime.indexOf("PM") !=-1) && (endTime.indexOf("PM") !=-1)){
                    hours = endHours - startHours
                }
                else if((startTime.indexOf("AM") !=-1) && (endTime.indexOf("PM") !=-1)){
                    hours = 12 - startHours + endHours;


                }
                else if((startTime.indexOf("PM") !=-1) && (endTime.indexOf("AM") !=-1)){
                    hours = startHours + endHours
                }
                else {
                    hours = endHours - startHours;
                }

                var miniutes = 0;
                if(startMinits <= endMiniutes){
                    miniutes = endMiniutes -startMinits;
                }
                else{
                    miniutes = endMiniutes + 60 -startMinits;
                    hours = hours -1;
                }
                if (hours<0){
                    hours =0;
                }
                if (miniutes<0){
                    miniutes =0;
                }
                if(!hours){
                    hours = 0
                }
                if(!miniutes)
                {
                    miniutes = 0
                }
                if (hours <9)
                    hours = '0' + hours;
                if (miniutes <9)
                    miniutes = '0' + miniutes;
                var duration = {"hours":hours,"miniutes":miniutes};
                return duration;
            };

            $scope.getOldFormatedTime  = function(time){
                if(time) {
                    var hours = time.split('T')[0];
                    var miniutes = time.split("T")[1].split("AM")[0].split("PM")[0];
                    if (hours.length<2)
                        hours = '0'+ hours;
                    if (miniutes.length<2)
                        miniutes = '0' + miniutes;
                    if(time.indexOf("AM") != -1)
                       return hours+':'+miniutes+"AM";
                    else
                        return hours + ':' + miniutes + "PM"
                }
                return false;
            };
            $scope.allProjectDetails = function(){
                // $scope.sDate = "";
                //$scope.currentFilterProject = $scope.projects[0];
                $scope.isShowProjectColumn = true;
                //$scope.isShowEmail = false;
                $scope.previousProjects.splice(0, $scope.previousProjects.length);
                var previousProjectDetails = jsonParser(employeeData.employeeProjectsDetails);
                if (previousProjectDetails.length <= 0)
                    return;
                for (project in previousProjectDetails) {

                    if( project == '0'){
                         previousDetails = previousProjectDetails[project].fields;
                        employeeEmail = previousDetails.email;
                        previousDetails = previousDetails.selectedProject;

                    }
                    else{
                         previousDetails = previousProjectDetails[project].fields;
                        employeeEmail = previousDetails.email;
                        previousDetails = previousDetails.selectedProject;

                    }

                    var startDate = ($scope.sDate);
                    $scope.returnIStDate = function(date){
                        return new Date(date);
                    }
                    for (prevD in previousDetails) {
                        if ((previousDetails[prevD].projectName !== undefined) && (previousDetails[prevD].isDelete != true) ) {
                                $scope.previousProjects.push([previousDetails[prevD],employeeEmail,$scope.getDuration(previousDetails[prevD])])

                        }
                        else if (previousDetails[prevD][0].isDelete != true) {

                                $scope.previousProjects.push([previousDetails[prevD][0],employeeEmail,  $scope.getDuration(previousDetails[prevD][0])])


                        }
                    }
                }
                $scope.allPreviousProject = $scope.previousProjects;
                return $scope.previousProjects.sort(function (a,b) {

                    var key1 = new Date(a[0].startDate) || new Date(a[2].startDate);
                    var key2 = new Date(b[0].startDate) || new Date(b[2].startDate);

                    if (key1 > key2) {
                        return -1;
                    } else if (key1 == key2) {
                        return 0;
                    } else {
                        return 1;
                    }
                });
                //console.log($scope.previousProjects);
            };
            $scope.allProjectDetails();

             $scope.currentPageNumber = 1;
            $scope.paginationProject = function () {
                if ($scope.currentPageNumber -1 <0)
                    return;
                $scope.fromRange = ($scope.currentPageNumber -1) * $scope.rows;

                if ($scope.fromRange <0){
                    $scope.fromRange = 0;
                }
                var rows = parseInt($scope.rows);
                var fromRange = parseInt($scope.fromRange) | 0;
                if ( $scope.toRange  == undefined)
                    $scope.toRange = 0;

                //var toRange = parseInt($scope.toRange + $scope.rows);
                var range =0;

                var projects = [];
                $scope.projectDetails = []
                if ($(window).width()< 600)
                    return $scope.previousProjects;
                for(fromRange;fromRange<$scope.previousProjects.length && range <= $scope.rows;) {
                    projects.push($scope.previousProjects[fromRange]);


                    fromRange = fromRange + 1;
                    range  = range+1;
                }


                $scope.totalPages = parseInt($scope.previousProjects.length/rows);
                $scope.accordianViewData = projects;
                 //$scope.emoData = $scope.getAcEmail( projects)


                return projects


            };
            $scope.counter = 0;
            var accordianData = [];
            function getTotalEmpTime(email, data){
                var total_hours = 0;
                var total_minutes = 0
                for(detail in data){
                    if(data[detail][1] == email){
                        total_hours += parseInt(data[detail][2].hours);
                        total_minutes += parseInt(data[detail][2].miniutes);
                    }
                }
                if (total_minutes >= 60){
                    var temp = parseInt(total_minutes/ 60)
                    total_hours += temp;
                    total_minutes = total_minutes % 60;

                }

                return {"hours":total_hours, "minutes": total_minutes}


            }
            function getEmailWiseData(email, data) {
                var taskList = [];

                for (detail in data) {
                    if (data[detail][1] == email) {
                        taskList.push(data[detail])

                    }

                }
                return taskList;
            }

             $scope.getAcEmail = function(empData) {
                //var empData = $scope.paginationProject();
                 var email = [];
                var details = {};
                var flag = false;
                 accordianData = [];
                 var x, y;
                for (x=0; x < empData.length; x++) {

                    flag = true;
                    details = {};
                    y = 0;
                    if ( accordianData.length === 0) {
                        details = {"email":empData[x][1], "totalTime":getTotalEmpTime(empData[x][1], empData) , "taskDetails":getEmailWiseData(empData[x][1], empData), "isActive": true,"value": "-" }
                         accordianData.push(details);
                        continue;
                    }

                    for (y=0; y<accordianData.length; y++) {
                        if ( accordianData[y].email == empData[x][1]) {
                             //accordianData[y][empData[x][1]].push(empData[x][2]);
                            flag = false;

                        }
                    }
                    if(flag) {
                        details = {"email":empData[x][1], "totalTime":getTotalEmpTime(empData[x][1], empData), "taskDetails":getEmailWiseData(empData[x][1], empData), "isActive": false, "value":"+"  }
                         accordianData.push(details);
                    }

                }


                return  accordianData;
             };
            $scope.makeActive = function(data){

                if(data.isActive == true){
                     //$(thk).text('+') ;
                    data.value = "+";
                    return false;


                }
                data.value = "-";
                 //thk.value = "-";
                //$(thk).val('-')
                return true;
            }
             //$scope.getAcEmail( $scope.accordianViewData )






             $scope.getTotalDuration = function(){
                var range = 0;
                var totalhours = 0;
                var totalMiniutes = 0;
                var project =  $scope.paginationProject();
                for (range =0;range< project.length;){
                    totalhours += parseInt(project[range][2].hours) || 0;
                    totalMiniutes += parseInt(project[range][2].miniutes) || 0;
                    range +=1;
                }
                if(totalMiniutes>=60){
                    var miniutes = totalMiniutes%60;
                    totalhours = totalhours + parseInt(totalMiniutes/60);
                    totalMiniutes = miniutes;
                }
                $scope.totalDuration = {"hours":totalhours,"miniutes": totalMiniutes};
                return $scope.totalDuration;
            };


            $scope.setDisableS = function(){
                if(parseInt($scope.fromRange) < 1){
                     //$("#textbox1").prop("disabled", true);

                }
                else {
                    //$("#textbox1").prop("disabled", false);
                    $scope.fromRange=  $scope.fromRange - $scope.rows;
                    $scope.currentPageNumber = parseInt($scope.fromRange/$scope.rows) +1;
                    if ($scope.fromRange <0){
                        $scope.fromRange =0;
                    }
                }
                $scope.emoData = $scope.getAcEmail( $scope.paginationProject())

            };
            $scope.setDisableT = function(){
                if ($scope.rows == undefined){
                    $scope.rows = 20;
                }
                if ($scope.toRange == undefined){
                    $scope.toRange = 0;
                }
                 if(parseInt($scope.fromRange) + parseInt($scope.rows) <$scope.previousProjects.length){
                      //$("#textbox2").prop("disabled", false);

                      $scope.fromRange=  $scope.fromRange + $scope.rows;
                     $scope.currentPageNumber = parseInt($scope.fromRange/$scope.rows) +1;
                     $scope.emoData = $scope.getAcEmail( $scope.paginationProject())
                    return true;
                }
                else {
                     //$("#textbox2").prop("disabled", true);

                 }
                $scope.emoData = $scope.getAcEmail( $scope.paginationProject())
                return false;

            };
            $scope.setDisableS();
            $scope.setDisableT();
            //$scope.getEachEmployeeTime();
            //console.log("awdfasfdaewdfasfsadfsadf", $(window).height(), $(document).height(), $(window).width(),$(document).width() )
            $scope.UsersList = [];
            $scope.changeEmployeeProject = function(){
                return $scope.employeeProjectEmails;
            };
             $scope.updateProjectUsers = function() {
                var data = $scope.projectModel();
                    ajaxindicatorstart(".....");
                    $http({
                        url: "/api/update-project-users",
                        dataType: 'json',
                        method: 'POST',
                        data : data[0],
                        headers: {
                            "Content-Type": "application/json"
                        }

                    }).then(function (resp) {
                         $(".submitResponse").text(resp.data);

                            $(".submitResponse").css('color',"green");
                            $(".submitResponse").show().delay(3000).fadeOut();

                         ajaxindicatorstop();



                    });


            };
            $scope.jsonToExcel = function(){
               var table = $("#tableToJson").tableToJSON();
                tableToJson(table, "Timesheets Report", true)


            };

            function tableToJson(JSONData, ReportTitle, ShowLabel) {
    var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;
    var CSV = '';
    CSV += ReportTitle + '\r\n\n';
    if (ShowLabel) {
        var row = "";
        for (var index in arrData[0]) {
            row += index + ',';
        }
        row = row.slice(0, -1);
        CSV += row + '\r\n';
    }
    for (var i = 0; i < arrData.length; i++) {
        var row = "";
        for (var index in arrData[i]) {
            row += '"' + arrData[i][index] + '",';
        }
        row.slice(0, row.length - 1);
        CSV += row + '\r\n';
    }

    if (CSV == '') {
        alert("Invalid data");
        return;
    }
    var fileName = "";
    fileName += ReportTitle.replace(/ /g,"_");
    var uri = 'data:text/csv;charset=utf-8,' + escape(CSV);
    var link = document.createElement("a");
    link.href = uri;
    link.style = "visibility:hidden";
    link.download = fileName + ".csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}




        }]
    }
}]);

cfDirectives.directive('donutChart', [function () {
    return {
        restrict: 'EA',
        scope: {},
        templateUrl: 'viewChart.html',
        controller: ["$scope", "employeeData", "$http", function ($scope, EmployeeData, $http) {
            $scope.abc = function () {
                return true;

            };

            function jsonParser(data) {
                data = JSON.parse(data);
                return data

            }

            function formatDate(date) {
                var d = new Date(date),
                    month = '' + (d.getMonth() + 1),
                    day = '' + d.getDate(),
                    year = d.getFullYear();

                if (month.length < 2) month = '0' + month;
                if (day.length < 2) day = '0' + day;

                return [year, month, day].join('-');
            }

            var myDate = new Date();
            var previousDay = new Date(myDate);
            previousDay.setDate(myDate.getDate() - 1);
            $scope.defaultDate = formatDate(previousDay);

            $scope.maxDate = formatDate(new Date(myDate));

            $scope.jsonToExcel = function () {
                var table = $(".tableToJson").tableToJSON();
                tableToJson(table, "Timesheets Report", true)


            };

            function tableToJson(JSONData, ReportTitle, ShowLabel) {
                var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;
                var CSV = '';
                CSV += ReportTitle + '\r\n\n';
                if (ShowLabel) {
                    var row = "";
                    for (var index in arrData[0]) {
                        row += index + ',';
                    }
                    row = row.slice(0, -1);
                    CSV += row + '\r\n';
                }
                for (var i = 0; i < arrData.length; i++) {
                    var row = "";
                    for (var index in arrData[i]) {
                        row += '"' + arrData[i][index] + '",';
                    }
                    row.slice(0, row.length - 1);
                    CSV += row + '\r\n';
                }

                if (CSV == '') {
                    alert("Invalid data");
                    return;
                }
                var fileName = "";
                fileName += ReportTitle.replace(/ /g, "_");
                var uri = 'data:text/csv;charset=utf-8,' + escape(CSV);
                var link = document.createElement("a");
                link.href = uri;
                link.style = "visibility:hidden";
                link.download = fileName + ".csv";
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }


            $scope.getEmpEmailData = function () {
                var empEmailData = [];
                var x = jsonParser(employeeData.employeeProjectsDetails);
                for (var i = 0; i < x.length; i++) {
                    if (x[i].fields.email == $scope.data['empEmailId']) {
                        empEmailData = x[i];
                    }
                }
                return empEmailData;
            };

            $scope.getProjectData = function (data) {
                var empEmailProjectData = [];
                var x = data.fields.selectedProject;
                for (var i = 0; i < x.length; i++) {
                    if (x[i].projectName == undefined) {
                        if (x[i][0].projectName == $scope.data['projectName']) {
                            empEmailProjectData.push(x[i][0]);
                        }
                    }
                    if (x[i].projectName == $scope.data['projectName']) {
                        empEmailProjectData.push(x[i]);
                    }
                }
                return empEmailProjectData;
            };

            $scope.getDateRangeData = function (data) {
                var dateRangeData = [];
                var x = data;
                for (var i = 0; i < x.length; i++) {
                    if ((formatDate(x[i].startDate) >= formatDate($scope.data['fromDate'])) && (formatDate(x[i].startDate) <= formatDate($scope.data['toDate']))) {
                        dateRangeData.push(x[i]);
                    }
                }
                return dateRangeData;
            };

            $scope.getDuration = function (projectObject) {
                if (projectObject.startDate == undefined)
                    projectObject = projectObject[0];
                var startTime = projectObject.startTime;
                var endTime = projectObject.endTime;

                if (startTime != '') {
                    var startMinits = parseInt((startTime.split('T')[1].replace("AM", "")).replace("PM", ""));
                    var endMiniutes = parseInt((endTime.split('T')[1].replace("AM", "")).replace("PM", ""));
                    var startHours = parseInt(startTime.split('T')[0]);
                    var endHours = parseInt(endTime.split('T')[0]);
                }
                else {
                    var startHours = (new Date(projectObject.newStartTime)).getHours();
                    var endHours = (new Date(projectObject.newEndTime)).getHours();
                    var startMinits = (new Date(projectObject.newStartTime)).getMinutes();
                    var endMiniutes = (new Date(projectObject.newEndTime)).getMinutes();

                }
                var hours = 0;
                if ((startTime.indexOf("AM") != -1) && (endTime.indexOf("AM") != -1)) {
                    hours = endHours - startHours;

                }
                else if ((startTime.indexOf("PM") != -1) && (endTime.indexOf("PM") != -1)) {
                    hours = endHours - startHours
                }
                else if ((startTime.indexOf("AM") != -1) && (endTime.indexOf("PM") != -1)) {
                    hours = 12 - startHours + endHours;


                }
                else if ((startTime.indexOf("PM") != -1) && (endTime.indexOf("AM") != -1)) {
                    hours = startHours + endHours
                }
                else {
                    hours = endHours - startHours;
                }

                var miniutes = 0;
                if (startMinits <= endMiniutes) {
                    miniutes = endMiniutes - startMinits;
                }
                else {
                    miniutes = endMiniutes + 60 - startMinits;
                    hours = hours - 1;
                }
                if (hours < 0) {
                    hours = 0;
                }
                if (miniutes < 0) {
                    miniutes = 0;
                }
                var duration = {"hours": hours, "miniutes": miniutes};
                return duration;
            };

            $scope.getCustomerIdTaskList = function () {
                var customerIdTaskList = [];

                for (var i = 0; i < $scope.taskList.length; i++) {
                    var c = $scope.taskList[i].taskOption;
                    if (c && c != "-") {
                        if ($scope.data['customerid'] == $scope.taskList[i].taskOption) {
                            customerIdTaskList.push($scope.taskList[i]);
                        }
                    }
                }
                return customerIdTaskList;

            };

            $scope.employeeEmails = [];
            function employeeMail() {
                var previousProjectDetails = jsonParser(employeeData.employeeProjectsDetails);
                if (previousProjectDetails.length == 0)
                    return;
                for (project in previousProjectDetails) {
                    previousDetails = previousProjectDetails[project].fields;
                    employeeEmail = previousDetails.email;
                    if (employeeEmail != 'sanjay@kustommade.com') {
                        $scope.employeeEmails.push(employeeEmail)
                    }
                }
                return $scope.employeeEmails;
            }

            $scope.employeeEmails = employeeMail();

            function getProjectName() {
                $scope.projects = [];
                for (name in x = jsonParser(employeeData.activeProject)) {
                    if (x[name])
                        $scope.projects.push(x[name].fields.projectName)

                }

                return $scope.projects;
            }

            $scope.projects = getProjectName();

            $scope.getCustomerIdList = function () {
                $scope.customerIdList = [];
                $scope.taskList = [];

                var projectDetails = jsonParser(employeeData.employeeProjectsDetails);
                var i = 0, c = "",d = '';
                for (each = 0; each < projectDetails.length; each++) {
                    var eachEmployeeEmailList = projectDetails[each].fields.selectedProject;
                    for (i = 0; i < eachEmployeeEmailList.length; i++) {
                        if (eachEmployeeEmailList[i].taskOption != undefined || eachEmployeeEmailList[i].taskOption === null) {
                            if (eachEmployeeEmailList[i].isDelete == undefined || eachEmployeeEmailList[i].isDelete == false) {
                                eachEmployeeEmailList[i]["employeeEmail"] = projectDetails[each].fields.email || "";
                                $scope.taskList.push(eachEmployeeEmailList[i]);
                                c = eachEmployeeEmailList[0].taskOption;
                                d = eachEmployeeEmailList[0].taskName.taskType;
                                if (c && c != "-" && (!$scope.customerIdList.includes(c)) && (d== 'Bonita' || d == 'BONITA' )) {
                                    $scope.customerIdList.push(c);
                                }
                            }
                        }
                        else {
                            if (eachEmployeeEmailList[i][0].isDelete == undefined || eachEmployeeEmailList[i][0].isDelete == false) {
                                eachEmployeeEmailList[i][0]["employeeEmail"] = projectDetails[each].fields.email || "";
                                $scope.taskList.push(eachEmployeeEmailList[i][0]);
                                c = eachEmployeeEmailList[i][0].taskOption;
                                if(eachEmployeeEmailList[0].taskName)
                                    d = eachEmployeeEmailList[0].taskName.taskType;
                                if (c && c != "-" && (!$scope.customerIdList.includes(c)) && (d== 'Bonita' || d == 'BONITA' )) {
                                    $scope.customerIdList.push(c);
                                }
                            }
                        }
                    }
                }

            };

            $scope.getTaskNameList = function () {
                $scope.activityList = [];
                $scope.taskList = [];
                var i =0;

                var projectDetails = jsonParser(employeeData.employeeProjectsDetails);
                for (each = 0; each < projectDetails.length; each++) {
                    var eachEmployeeEmailList = projectDetails[each].fields.selectedProject;
                    for (i = 0; i < eachEmployeeEmailList.length; i++) {
                        if (eachEmployeeEmailList[i].taskName != undefined) {
                            if (eachEmployeeEmailList[i].isDelete == undefined || eachEmployeeEmailList[i].isDelete == false) {
                                eachEmployeeEmailList[i]["employeeEmail"] = projectDetails[each].fields.email;
                                $scope.taskList.push(eachEmployeeEmailList[i]);
                                var c = eachEmployeeEmailList[0].taskName.name;
                                if (c && (!$scope.activityList.includes(c))) {
                                    $scope.activityList.push(c);
                                }
                            }
                        }
                        else {
                            if (eachEmployeeEmailList[i][0].isDelete == undefined || eachEmployeeEmailList[i][0].isDelete == false) {
                                eachEmployeeEmailList[i][0]["employeeEmail"] = projectDetails[each].fields.email;
                                $scope.taskList.push(eachEmployeeEmailList[i][0]);
                                c = eachEmployeeEmailList[i][0].taskName.name;
                                if (c && (!$scope.activityList.includes(c))) {
                                    $scope.activityList.push(c);
                                }
                            }
                        }
                    }
                }

            };

            $scope.getActivityEmployeeList = function () {
                var activityEmployeeList = [];

                for (var i = 0; i < $scope.taskList.length; i++) {
                    var c = $scope.taskList[i].taskName.name;
                    if (c) {
                        if ($scope.data['activity'] == $scope.taskList[i].taskName.name) {
                            activityEmployeeList.push($scope.taskList[i]);
                        }
                    }
                }
                return activityEmployeeList;
            };

            $scope.data = {};
             $scope.totalTimeForEmp = 0;

            $scope.minutesToHours = function(minutes) {
                if ((parseInt(minutes / 60) == 0) &&((minutes % 60) == 0))
                    return "-";

        return (parseInt(minutes / 60) + "h  " + (minutes % 60) + "m");

    };

        $scope.projectName = "";

         $scope.getTaskName = function() {
             $scope.prevTasks = [];
             for (tk in x = JSON.parse(employeeData.activeTask)) {
                 if (x[tk].fields.projectName == $scope.projectName) {
                     $scope.prevTasks = x[tk].fields.task;
                 }
             }
             return  $scope.prevTasks;
         };
            $scope.projectName = $scope.projects[0];
            $scope.prevTasks =  $scope.getTaskName();
            $scope.tasksName = $scope.getTaskName();
             $scope.getTotalEmpTime = function(){
                 $scope.totalTimeForEmp = 0;
                    var data = $scope.employeeTablesData;
                    for(x in data){
                        $scope.totalTimeForEmp += $scope.gettotaltasktime(data[x])
                    }
                 return $scope.totalTimeForEmp;
                };
            $scope.getEmployeeTableData = function(){
                 $scope.totalTimeForEmp = 0;

                 $scope.data['empEmailId'] = $scope.empEmail;
                    $scope.data['projectName'] = $scope.projectName;
                    $scope.data['fromDate'] = $scope.fromDate;
                    $scope.data['toDate'] = $scope.toDate;


                    var empEmailData = $scope.getEmpEmailData();
                    var empEmailProjectData = $scope.getProjectData(empEmailData);
                    var dateRangeData = $scope.getDateRangeData(empEmailProjectData);

                    var x = dateRangeData;
                    for (var i = 0; i < x.length; i++) {
                        var timeSpend = $scope.getDuration(x[i]);
                        var timeMinutes = (parseInt(timeSpend.hours) * 60) + parseInt(timeSpend.miniutes);
                        if(isNaN(timeMinutes)) {
                            dateRangeData[i]['timeMinutes'] = 0;
                        }
                        else{
                            dateRangeData[i]['timeMinutes'] = timeMinutes;
                        }
                    }

                    $scope.chartDatad3 = [dateRangeData];

                $scope.isTableView = false;
                $scope.isEmployeeTable = true;
                $scope.employeeEmailCustomer = true;
                var data = $scope.chartDatad3;
                $scope.employeeTablesData = {};


                var tempDict = {};
                for(details in data[0]){
                    tempDict = {};
                    if (data[0][details].taskName) {
                        tempDict[data[0][details].taskName.name] = data[0][details].timeMinutes;
                        if($scope.employeeTablesData[data[0][details].startDate]){
                            $scope.employeeTablesData[data[0][details].startDate].push(tempDict)
                        }
                        else {
                            $scope.employeeTablesData[data[0][details].startDate] = [];
                            $scope.employeeTablesData[data[0][details].startDate].push(tempDict)
                        }
                    }
                    else
                    {
                     if($scope.employeeTablesData[data[details].startDate]){
                            $scope.employeeTablesData[data[details].startDate].push(tempDict)
                        }
                        else {
                            $scope.employeeTablesData[data[details].startDate] = [];
                            $scope.employeeTablesData[data[details].startDate].push(tempDict)
                        }
                    }


                }
                return $scope.employeeTablesData;
            };
            $scope.gettotaltasktime = function(values){
                var time = 0;
                for( value  in values) {
                    for( key in values[value])
                    {
                        time += parseInt(values[value][key]);
                    }
                }

                return time;

            };
            $scope.getCurrenttaskname = function(values, taskname ){
                var time = 0;
                for( value  in values) {
                    for( key in values[value])
                    {
                        if (key == taskname)
                            time += parseInt(values[value][key]);
                    }
                }
                return time;

            };
            $scope.totalTime = 0;

            $scope.taskCustomer = function () {
                $scope.employeeEmailCustomer = true;

                $scope.customerDiv = false;
                $scope.activityDiv = false;

                d3.selectAll("svg > *").remove();
                d3.select('#table_div').remove();
                d3.select('#table_div2').remove();
                d3.select('#table_div3').remove();
                d3.select('#table_div4').remove();
                d3.select('#chart').remove();
                d3.select('#chart2').remove();
                d3.select('#legend').remove();
                d3.select('#legend2').remove();
                isEmployeeTable = false;
                $scope.showTables = function(){
                    isEmployeeTable = true;
                };
                //$scope.isTableView = true;
                $scope.filterByEmployeeEmail = function () {
                    $scope.isTableView = true;

                    $scope.data['empEmailId'] = $scope.empEmail;
                    $scope.data['projectName'] = $scope.projectName;
                    $scope.data['fromDate'] = $scope.fromDate;
                    $scope.data['toDate'] = $scope.toDate;


                    var empEmailData = $scope.getEmpEmailData();
                    var empEmailProjectData = $scope.getProjectData(empEmailData);
                    var dateRangeData = $scope.getDateRangeData(empEmailProjectData);

                    var x = dateRangeData;
                    for (var i = 0; i < x.length; i++) {
                        var timeSpend = $scope.getDuration(x[i]);
                        var timeMinutes = (parseInt(timeSpend.hours) * 60) + parseInt(timeSpend.miniutes);
                        if(isNaN(timeMinutes)) {
                            dateRangeData[i]['timeMinutes'] = 0;
                        }
                        else{
                            dateRangeData[i]['timeMinutes'] = timeMinutes;
                        }
                    }

                    $scope.chartDatad3 = [dateRangeData];


                };
            };


            $scope.customer11 = function () {
                $scope.isTableView = true;
                $scope.employeeEmailCustomer = false;
                $scope.customerDiv = true;
                $scope.activityDiv = false;

                d3.selectAll("svg > *").remove();
                d3.select('#table_div').remove();
                d3.select('#table_div2').remove();
                d3.select('#table_div3').remove();
                d3.select('#table_div4').remove();
                d3.select('#chart').remove();
                d3.select('#chart2').remove();
                d3.select('#legend').remove();
                d3.select('#legend2').remove();

                $scope.getCustomerIdList();
                $scope.customerTableView = function()

                {
                     $scope.totalTimeForEmp =0;
                      $scope.data['customerid'] = $scope.customerId;
                    $scope.data['fromDate'] = $scope.fromDate;
                    $scope.data['toDate'] = $scope.toDate;


                    var customerIdTaskList = $scope.getCustomerIdTaskList();
                    var dateRangeData = $scope.getDateRangeData(customerIdTaskList);


                    var x = dateRangeData;
                    for (var i = 0; i < x.length; i++) {
                        var timeSpend = $scope.getDuration(x[i]);
                        var timeMinutes = (parseInt(timeSpend.hours) * 60) + parseInt(timeSpend.miniutes);
                        if (isNaN(timeMinutes)) {
                            dateRangeData[i]['timeMinutes'] = 0;
                        }
                        else {
                            dateRangeData[i]['timeMinutes'] = timeMinutes;
                        }
                    }

                    $scope.chartDatad3 = [dateRangeData];
                    $scope.isTableView = false;
                $scope.isEmployeeTable = true;
                $scope.employeeEmailCustomer = false;

                var data = $scope.chartDatad3;
                $scope.employeeTablesData = {};

                var tempDict = {};
                for(details in data[0]){
                    tempDict = {};
                    if (data[0][details].taskName) {
                        tempDict[data[0][details].taskName.name] = data[0][details].timeMinutes;
                        if($scope.employeeTablesData[data[0][details].startDate]){
                            $scope.employeeTablesData[data[0][details].startDate].push(tempDict)
                        }
                        else {
                            $scope.employeeTablesData[data[0][details].startDate] = [];
                            $scope.employeeTablesData[data[0][details].startDate].push(tempDict)
                        }
                    }
                    else
                    {
                     if($scope.employeeTablesData[data[details].startDate]){
                            $scope.employeeTablesData[data[details].startDate].push(tempDict)
                        }
                        else {
                            $scope.employeeTablesData[data[details].startDate] = [];
                            $scope.employeeTablesData[data[details].startDate].push(tempDict)
                        }
                    }


                }
                return $scope.employeeTablesData;


                };

                $scope.filterByCustomerId = function () {
                     $scope.isTableView = true;


                    $scope.data['customerid'] = $scope.customerId;
                    $scope.data['fromDate'] = $scope.fromDate;
                    $scope.data['toDate'] = $scope.toDate;


                    var customerIdTaskList = $scope.getCustomerIdTaskList();
                    var dateRangeData = $scope.getDateRangeData(customerIdTaskList);


                    var x = dateRangeData;
                    for (var i = 0; i < x.length; i++) {
                        var timeSpend = $scope.getDuration(x[i]);
                        var timeMinutes = (parseInt(timeSpend.hours) * 60) + parseInt(timeSpend.miniutes);
                        if (isNaN(timeMinutes)) {
                            dateRangeData[i]['timeMinutes'] = 0;
                        }
                        else {
                            dateRangeData[i]['timeMinutes'] = timeMinutes;
                        }
                    }

                    $scope.chartDatad3 = [dateRangeData];

                }
            };

            $scope.activityName = function () {
                $scope.isTableView = true;
                $scope.employeeEmailCustomer = false;
                $scope.customerDiv = false;
                $scope.activityDiv = true;

                d3.selectAll("svg > *").remove();
                d3.select('#table_div').remove();
                d3.select('#table_div2').remove();
                d3.select('#table_div3').remove();
                d3.select('#table_div4').remove();
                d3.select('#chart').remove();
                d3.select('#chart2').remove();
                d3.select('#legend').remove();
                d3.select('#legend2').remove();

                $scope.getTaskNameList();

                $scope.filterByActivity = function () {

                    $scope.data['activity'] = $scope.activity;
                    $scope.data['fromDate'] = $scope.fromDate;
                    $scope.data['toDate'] = $scope.toDate;


                    var activityEmployeeList = $scope.getActivityEmployeeList();
                    var dateRangeData = $scope.getDateRangeData(activityEmployeeList);


                    var x = dateRangeData;
                    for (var i = 0; i < x.length; i++) {
                        var timeSpend = $scope.getDuration(x[i]);
                        var timeMinutes = (parseInt(timeSpend.hours) * 60) + parseInt(timeSpend.miniutes);
                        if (isNaN(timeMinutes)) {
                            dateRangeData[i]['timeMinutes'] = 0;
                        }
                        else {
                            dateRangeData[i]['timeMinutes'] = timeMinutes;
                        }
                    }

                    $scope.chartDatad3 = [dateRangeData];

                }

            }

        }]
    }
}]);


cfDirectives.directive('pieChart', function () {

    function minutesToHours(minutes) {
        return (parseInt(minutes / 60) + " hours  " + (minutes % 60) + " minutes");
    }

    function link(scope, element) {
        var jsonData = scope.data;
        var taskList = [];
        var minutesArray = [];



        for (var each = 0; each < jsonData.length; each++) {

            if(jsonData[each].taskOption === null){
                jsonData[each].taskOption = jsonData[each].taskName.name;
            }

            var taskName = jsonData[each].taskName.name;

            var key_flag = 0;
            for (var i = 0; i < taskList.length; i++) {
                if (taskName == taskList[i].taskName && jsonData[each].timeMinutes > 0) {
                    key_flag = 1;
                    taskList[i]['time'] = taskList[i]['time'] + jsonData[each].timeMinutes;
                }
            }
            if (key_flag == 0 && jsonData[each].timeMinutes > 0) {
                taskList.push({'taskName': jsonData[each].taskName.name, 'taskType': jsonData[each].taskName.taskType, 'time': jsonData[each].timeMinutes});
            }
        }

        for (i = 0; i < taskList.length; i++) {
            minutesArray.push(taskList[i]['time']);
        }

        var color = d3.scaleOrdinal(d3.schemeCategory20);
        var width = 300, height = 300;
        var radius = 150;

        var canvas = d3.select(element[0]).append('svg').attr('width', width).attr('height', height);
        var group = canvas.append('g').attr('transform', 'translate(150,150)');

        var arc = d3.arc().innerRadius(75).outerRadius(radius);
        var pie = d3.pie()
            .value(function (d, i) {
                return minutesArray[i];
            })
            .sort(null);


        var arcs = group.selectAll('arc').data(pie(taskList)).enter();

        var path = arcs.append('path').attr('d', arc).attr('fill', function (d, i) {
            return color(i);
        }).attr('stroke', 'white').attr('stroke-width', '2px');

        arcs.append('text')
            .attr('transform', function (d) {
                return 'translate(' + arc.centroid(d) + ')';
            })
            .attr('dy', '0.35em')
            .style('text-anchor', 'middle')
            .attr('font-size', '1em')
            .text(function (d, i) {
                return d.data.taskName.substring(0, 1);
            });

        var onClickDetails = path;

////////////    ON HOVER TIME DISPLAY DIV    ///////////////////

        path.on('mouseover', function (d) {
            d3.select("#tooltip")
                .style("left", d3.event.pageX + "px")
                .style("top", d3.event.pageY + "px")
                .style("opacity", 1)
                .style('z-index', 100)
                .html(d.data.taskName + "<br>" + minutesToHours(d.data.time));
        });

        path.on('mouseout', function () {
            d3.select("#tooltip")
                .style("opacity", 0);
        });

////////////    TOTAL HOURS DISPLAY DIV     ///////////////////

        var totalhours = d3.select('#chart').append('text')
            .style('fill', 'rgb(31, 119, 180)')
            .attr('font-size', '2em')
            .text(function (d) {

                var total = d3.sum(jsonData.map(function (d) {
                    return d.timeMinutes;
                }));

                return ("Total hours spent is : " + minutesToHours(total));
            });

////////////    LEGEND     ///////////////////

        var legend = d3.select('#legend')
            .style('display', function(){
                if(jsonData.length > 0){
                    return 'block';
                }
            })
            .append('svg').attr('width', 300).attr('height', 500).append('g')
            .attr('class', 'legend')
            .attr("transform", function (d, i) {
                return "translate(-300,0)"
            })
            .style('display', 'block');

        legend.selectAll('rect')
            .data(taskList)
            .enter()
            .append("rect")
            .attr("x", width - 75)
            .attr("y", function (d, i) {
                return i * 20;
            })
            .attr("x", 300)
            .attr("width", 18).attr("height", 18)
            .style("fill", function (d, i) {
                return color(i);
            });

        legend.selectAll('text')
            .data(taskList)
            .enter()
            .append("text")
            .attr("x", width - 65)
            .attr("y", function (d, i) {
                return i * 20 + 5;
            })
            .attr("transform", function (d, i) {
                return "translate(0," + (i*20) + ")"
            })
            .attr("x", 320)
            .attr("y", 9).attr("dy", ".35em")
            .style("text-anchor", "front")
            .text(function (d) {
                return d.taskName;
            });

////////////    ON CLICK TABLE     ///////////////////

        onClickDetails.style("cursor", "pointer").on('click', function (d) {

            d3.select("#table_div").html('');

            var customerList = [];
            var key = "";
            var taskNameHeader = d.data.taskName;
            var totalTime = minutesToHours(d.data.time);

            for (var each = 0; each < jsonData.length; each++) {
                if (d.data.taskName == jsonData[each].taskName.name) {

                    if (jsonData[each].taskOption) {

                        key = jsonData[each].taskOption.split('-')[0];

                        var key_flag = 0;
                        for (var i = 0; i < customerList.length; i++) {
                            if (key == customerList[i].projectId && jsonData[each].timeMinutes > 0) {
                                key_flag = 1;
                                customerList[i]['time'] = customerList[i]['time'] + jsonData[each].timeMinutes;
                            }
                        }
                        if (key_flag == 0 && jsonData[each].timeMinutes > 0) {
                            customerList.push({'projectId': key, 'time': jsonData[each].timeMinutes, 'customerName': jsonData[each].taskOption.split('-')[1]});
                        }
                    }
                }
            }

            var columns = ['projectId', 'time', 'customerName'];

            var table = d3.select('#table_div').append('table');
            var thead = table.append('thead');
            var tbody = table.append('tbody');

            thead.append('tr')
                .append('th')
                .attr('colspan', columns.length)
                .style('padding', '8px')
                .style('text-align', 'left')
                .text(taskNameHeader);

            thead.append('tr')
                .selectAll('th')
                .data(columns)
                .enter()
                .append('th')
                .text(function (column) {
                    return column.replace(/([A-Z])/g, " $1").toUpperCase();
                });

            var rows = tbody.selectAll('tr')
                .data(customerList)
                .enter()
                .append('tr');

            var cells = rows.selectAll('td')
                .data(function (row) {
                    return columns.map(function (column) {
                        var value = "";

                        if (column == 'time') {
                            value = minutesToHours(row[column]);
                        }
                        else {
                            value = row[column];
                        }

                        return {column: column, value: value};
                    })
                })
                .enter()
                .append('td')
                .text(function (d) {
                    return d.value;
                });

            tbody.append('td')
                .attr('colspan', columns.length)
                .style('padding', '8px')
                .style('text-align', 'center')
                .style('font-weight', 'bold')
                .style('background', '#D8D8D8')
                .text("TOTAL TIME : " + totalTime);


            return table;
        });

    }

    return {
        link: link,
        restrict: 'EA',
        scope: {data: '='}

    }

});


cfDirectives.directive('pieChart2', function () {

    function minutesToHours(minutes) {
        return (parseInt(minutes / 60) + " hours  " + (minutes % 60) + " minutes");
    }

    function link(scope, element) {
        var jsonData = scope.data;
        var taskList = [];
        var minutesArray = [];

        for (var each = 0; each < jsonData.length; each++) {

            var taskName = jsonData[each].taskName.name;

            var key_flag = 0;
            for (var i = 0; i < taskList.length; i++) {
                if (taskName == taskList[i].taskName && jsonData[each].timeMinutes > 0) {
                    key_flag = 1;
                    taskList[i]['time'] = taskList[i]['time'] + jsonData[each].timeMinutes;
                }
            }
            if (key_flag == 0 && jsonData[each].timeMinutes > 0) {
                taskList.push({'taskName': jsonData[each].taskName.name, 'taskType': jsonData[each].taskName.taskType, 'time': jsonData[each].timeMinutes});
            }
        }

        for (i = 0; i < taskList.length; i++) {
            minutesArray.push(taskList[i]['time']);
        }

        var color = d3.scaleOrdinal(d3.schemeCategory20);
        var width = 1000, height = 300;
        var radius = 150;

        var canvas = d3.select(element[0]).append('svg').attr('width', width).attr('height', height);
        var group = canvas.append('g').attr('transform', 'translate(150,150)');

        var arc = d3.arc().innerRadius(75).outerRadius(radius);
        var pie = d3.pie()
            .value(function (d, i) {
                return minutesArray[i];
            })
            .sort(null);


        var arcs = group.selectAll('arc').data(pie(taskList)).enter();

        var path = arcs.append('path').attr('d', arc).attr('fill', function (d, i) {
            return color(i);
        }).attr('stroke', 'white').attr('stroke-width', '2px');

        var onClickDetails = arcs.append('text')
            .attr('transform', function (d) {
                return 'translate(' + arc.centroid(d) + ')';
            })
            .attr('dy', '0.35em')
            .style('text-anchor', 'middle')
            .attr('font-size', '1em')
            .text(function (d, i) {
                return d.data.taskName.substring(0, 1);
            });

////////////    ON HOVER TIME DISPLAY DIV    ///////////////////

        path.on('mouseover', function (d) {
            d3.select("#tooltip2")
                .style("left", d3.event.pageX + "px")
                .style("top", d3.event.pageY + "px")
                .style("opacity", 1)
                .style('z-index', 100)
                .html(d.data.taskName + "<br>" + minutesToHours(d.data.time));
        });

        path.on('mouseout', function () {
            d3.select("#tooltip2")
                .style("opacity", 0);
        });

////////////    TOTAL HOURS DISPLAY DIV     ///////////////////

        var totalhours = d3.select('#chart2').append('text')
            .style('fill', 'rgb(31, 119, 180)')
            .attr('font-size', '2em')
            .text(function (d) {

                var total = d3.sum(jsonData.map(function (d) {
                    return d.timeMinutes;
                }));

                return ("Total hours spent is : " + minutesToHours(total));
            });

////////////    LEGEND     ///////////////////

        var legend = d3.select('#legend2')
            .style('display', function(){
                if(jsonData.length > 0){
                    return 'block';
                }
            })
            .append('svg').attr('width', 300).attr('height', 500).append('g')
            //.attr('class', 'legend')
            .attr("transform", function (d, i) {
                return "translate(-300,0)"
            })
            .style('display', 'block');

        legend.selectAll('rect')
            .data(taskList)
            .enter()
            .append("rect")
            .attr("x", width - 75)
            .attr("y", function (d, i) {
                return i * 20;
            })
            .attr("x", 300)
            .attr("width", 18).attr("height", 18)
            .style("fill", function (d, i) {
                return color(i);
            });

        legend.selectAll('text')
            .data(taskList)
            .enter()
            .append("text")
            .attr("x", width - 65)
            .attr("y", function (d, i) {
                return i * 20 + 5;
            })
            .attr("transform", function (d, i) {
                return "translate(0," + (i*20) + ")"
            })
            .attr("x", 320)
            .attr("y", 9).attr("dy", ".35em")
            .style("text-anchor", "front")
            .text(function (d) {
                return d.taskName;
            });

////////////    ON CLICK TABLE     ///////////////////

        path.style("cursor", "pointer").on('click', function (d) {

            d3.select("#table_div2").html('');

            var employeeList = [];
            var key = "";
            var taskNameHeader = d.data.taskName;
            var totalTime = minutesToHours(d.data.time);

            for (var each = 0; each < jsonData.length; each++) {
                if (d.data.taskName == jsonData[each].taskName.name) {

                    key = jsonData[each].employeeEmail;

                    var key_flag = 0;
                    for (var i = 0; i < employeeList.length; i++) {
                        if (key == employeeList[i].employeeEmail && jsonData[each].timeMinutes > 0) {
                            key_flag = 1;
                            employeeList[i]['time'] = employeeList[i]['time'] + jsonData[each].timeMinutes;
                        }
                    }
                    if (key_flag == 0 && jsonData[each].timeMinutes > 0) {
                        employeeList.push({'employeeEmail': key, 'time': jsonData[each].timeMinutes});
                    }
                }
            }

            var columns = ['employeeEmail', 'time'];

            var table = d3.select('#table_div2').append('table');
            var thead = table.append('thead');
            var tbody = table.append('tbody');

            thead.append('tr')
                .append('th')
                .attr('colspan', columns.length)
                .style('padding', '8px')
                .style('text-align', 'left')
                .text(taskNameHeader);


            thead.append('tr')
                .selectAll('th')
                .data(columns)
                .enter()
                .append('th')
                .text(function (column) {
                    return column.replace(/([A-Z])/g, " $1").toUpperCase();
                });

            var rows = tbody.selectAll('tr')
                .data(employeeList)
                .enter()
                .append('tr');

            var cells = rows.selectAll('td')
                .data(function (row) {
                    return columns.map(function (column) {
                        var value = "";

                        if (column == 'time') {
                            value = minutesToHours(row[column]);
                        }
                        else {
                            value = row[column];
                        }

                        return {column: column, value: value};
                    })
                })
                .enter()
                .append('td')
                .text(function (d) {
                    return d.value;
                });

            tbody.append('td')
                .attr('colspan', columns.length)
                .style('padding', '8px')
                .style('text-align', 'center')
                .style('font-weight', 'bold')
                .style('background', '#D8D8D8')
                .text("TOTAL TIME : " + totalTime);

            return table;
        });

    }

    return {
        link: link,
        restrict: 'EA',
        scope: {data: '='}

    }

});

cfDirectives.directive('pieChart3', function () {

    function minutesToHours(minutes) {
        return (parseInt(minutes / 60) + " hours  " + (minutes % 60) + " minutes");
    }

    function link(scope, element) {
        var jsonData = scope.data;
        var taskList = [];
        var totalTime = 0;


        for (var each = 0; each < jsonData.length; each++) {

            var employeeEmail = jsonData[each].employeeEmail;

            var key_flag = 0;
            for (var i = 0; i < taskList.length; i++) {
                if (employeeEmail == taskList[i].employeeEmail && jsonData[each].timeMinutes > 0) {
                    key_flag = 1;
                    taskList[i]['time'] = taskList[i]['time'] + jsonData[each].timeMinutes;
                    totalTime += jsonData[each].timeMinutes;
                }
            }
            if (key_flag == 0 && jsonData[each].timeMinutes > 0) {
                taskList.push({
                    'taskName': jsonData[each].taskName.name,
                    'taskType': jsonData[each].taskName.taskType,
                    'time': jsonData[each].timeMinutes,
                    'employeeEmail': jsonData[each].employeeEmail
                });
                totalTime += jsonData[each].timeMinutes;
            }
        }

        var columns = ['employeeEmail', 'time'];

        var table = d3.select('#table_div3').append('table');
        var thead = table.append('thead');
        var tbody = table.append('tbody');

        thead.append('tr')
            .selectAll('th')
            .data(columns)
            .enter()
            .append('th')
            .text(function (column) {
                return column.replace(/([A-Z])/g, " $1").toUpperCase();
            });

        var rows = tbody.selectAll('tr')
            .data(taskList)
            .enter()
            .append('tr');

        var cells = rows.selectAll('td')
            .data(function (row) {
                return columns.map(function (column) {
                    var value = "";

                    if (column == 'time') {
                        value = minutesToHours(row[column]);
                    }
                    else {
                        value = row[column];
                    }

                    return {column: column, value: value};
                })
            })
            .enter()
            .append('td')
            .text(function (d) {
                return d.value;
            });

////////////    ON CLICK TABLE     ///////////////////

        var changeColor = tbody.selectAll("tr")
            .on("click", function () {
                d3.selectAll('tr').style("background-color", "white");
                d3.select(this).style("background-color", "#AEDCEB");

            });

        cells.style("cursor", function (d) {
                if (d.column == "employeeEmail") {
                    return "pointer";
                }
            })
            .on('click', function (d) {
                if (d.column == "employeeEmail") {

                    d3.select("#table_div4").html('');

                    var customerList = [];
                    var key = "";
                    var employeeEmailHeader = d.value;
                    var totalTime = 0;

                    for (var each = 0; each < jsonData.length; each++) {
                        if (d.value == jsonData[each].employeeEmail) {

                            if (jsonData[each].taskOption) {

                                key = jsonData[each].taskOption.split('-')[0];

                                var key_flag = 0;
                                for (var i = 0; i < customerList.length; i++) {
                                    if (key == customerList[i].projectId && jsonData[each].timeMinutes > 0) {
                                        key_flag = 1;
                                        customerList[i]['time'] = customerList[i]['time'] + jsonData[each].timeMinutes;
                                        totalTime += jsonData[each].timeMinutes;
                                    }
                                }
                                if (key_flag == 0 && jsonData[each].timeMinutes > 0) {
                                    customerList.push({'projectId': key, 'time': jsonData[each].timeMinutes, 'customerName': jsonData[each].taskOption.split('-')[1]});
                                    totalTime += jsonData[each].timeMinutes;
                                }
                            }
                        }
                    }

                    var columns = ['projectId', 'time', 'customerName'];

                    var table = d3.select('#table_div4').append('table');
                    var thead = table.append('thead');
                    var tbody = table.append('tbody');

                    thead.append('tr')
                        .append('th')
                        .attr('colspan', columns.length)
                        .style('padding', '8px')
                        .style('text-align', 'left')
                        .text(employeeEmailHeader);

                    thead.append('tr')
                        .selectAll('th')
                        .data(columns)
                        .enter()
                        .append('th')
                        .text(function (column) {
                            return column.replace(/([A-Z])/g, " $1").toUpperCase();
                        });

                    var rows = tbody.selectAll('tr')
                        .data(customerList)
                        .enter()
                        .append('tr');

                    var cells = rows.selectAll('td')
                        .data(function (row) {
                            return columns.map(function (column) {
                                var value = "";

                                if (column == 'time') {
                                    value = minutesToHours(row[column]);
                                }
                                else {
                                    value = row[column];
                                }

                                return {column: column, value: value};
                            })
                        })
                        .enter()
                        .append('td')
                        .text(function (d) {
                            return d.value;
                        });

                    tbody.append('td')
                        .attr('colspan', columns.length)
                        .style('padding', '8px')
                        .style('text-align', 'center')
                        .style('font-weight', 'bold')
                        .style('background', '#D8D8D8')
                        .text("TOTAL TIME : " + minutesToHours(totalTime));


                    return table;
                }
            });

        tbody.append('td')
            .attr('colspan', columns.length)
            .style('padding', '8px')
            .style('text-align', 'center')
            .style('font-weight', 'bold')
            .style('background', '#D8D8D8')
            .text("TOTAL TIME : " + minutesToHours(totalTime));

        return table;

    }


    return {
        link: link,
        restrict: 'EA',
        scope: {data: '='}

    }

});
