StudyGroupsApp.controller('StudyGroupListController', function($scope, $location, $rootScope, Api){
  $rootScope.loading = true;

  Api.getUsersStudyGroups()
    .then(function(groups){
      $scope.groups = groups.data;

      $rootScope.loading = false;
    });

  $scope.newStudyGroup = {};

  $scope.toggleStudyGroupForm = function(){
    $scope.studyGroupFormIsShowing = !$scope.studyGroupFormIsShowing;
  }

  $scope.createStudyGroup = function(){
    Api.createStudyGroup($scope.newStudyGroup)
      .then(function(group){
        $location.path('/study-groups/' + group.data.id + '/' + group.data.key);
      })
      .catch(function(){
        $rootScope.showInputError = true;
      });
  }
});
