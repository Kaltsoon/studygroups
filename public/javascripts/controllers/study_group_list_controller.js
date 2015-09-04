StudyGroupsApp.controller('StudyGroupListController', function($scope, $location, Api){
  Api.getUsersStudyGroups()
    .then(function(groups){
      $scope.groups = groups.data;
    });

  $scope.newStudyGroup = {};

  $scope.toggleStudyGroupForm = function(){
    $scope.studyGroupFormIsShowing = !$scope.studyGroupFormIsShowing;
  }

  $scope.createStudyGroup = function(){
    Api.createStudyGroup($scope.newStudyGroup)
      .then(function(group){
        $location.path('/study-groups/' + group.data.id + '/' + group.data.key);
      });
  }
});
