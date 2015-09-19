StudyGroupsApp.controller('ProfileController', function($scope, $routeParams, $window, $rootScope, Api){
  $scope.editedUser = {};

  Api.getUser($routeParams.username)
    .then(function(user){
      $scope.user = user.data;
      $scope.editedUser = _.pick($scope.user, 'email', 'description', 'id');
    })

  $scope.toggleEditing = function(){
    $scope.isEditing = !$scope.isEditing;
  }

  $scope.updateProfile = function(){
    Api.updateUser($scope.editedUser)
      .then(function(){
        $scope.isEditing = false;
        _.extend($scope.user, $scope.editedUser);
      })
      .catch(function(){
        $rootScope.showInputError = true;
      });
  }

  $scope.removeProfile = function(){
    if(confirm('Are you sure you wan\'t to remove your profile?')){
      Api.removeUser($scope.user.id)
        .then(function(){
          $window.location.replace('/welcome');
        });
    }
  }
});
