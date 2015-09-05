StudyGroupsApp.controller('ProfileController', function($scope, $routeParams, $location, Api){
  Api.getUser($routeParams.username)
    .then(function(user){
      $scope.user = user.data;
    })
});
