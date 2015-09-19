StudyGroupsApp.controller('StudyGroupController', function($scope, $location, $routeParams, $rootScope, Api){
  $scope.editedGroup = {};

  $scope.shareUrl = $location.absUrl();

  Api.getStudyGroup($routeParams.id, $routeParams.key)
    .then(function(group){
      $scope.group = group.data;
      $scope.editedGroup = _.pick($scope.group, 'name', 'description', 'id');
    })
    .catch(function(){
      $location.path('/study-groups');
    });

  $scope.toggleEditing = function(){
    $scope.isEditing = !$scope.isEditing;
  }

  $scope.updateStudyGroup = function(){
    Api.updateStudyGroup($scope.editedGroup)
      .then(function(){
        $scope.isEditing = false;
        _.extend($scope.group, $scope.editedGroup);
      })
      .catch(function(){
        $rootScope.showInputError = true;
      });
  }

  $scope.removeStudyGroup = function(){
    if(confirm('Are you sure you wan\'t to remove this study group?')){
      Api.removeStudyGroup($routeParams.id)
        .then(function(){
          $location.path('/study-groups');
        });
    }
  }
});
