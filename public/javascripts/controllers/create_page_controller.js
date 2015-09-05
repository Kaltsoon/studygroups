StudyGroupsApp.controller('CreatePageController', function($scope, $location, $rootScope, $routeParams, Api){
  $scope.newPage = {};

  Api.getStudyGroup($routeParams.id, $routeParams.key)
    .then(function(group){
      $scope.group = group.data;

      if($scope.group.UserId != $rootScope.userSignedIn.id){
        $location.path('/study-groups');
      }
    });

  $scope.createPage = function(){
    $scope.newPage.StudyGroupId = $routeParams.id;

    Api.createPage($scope.newPage)
      .then(function(page){
        $location.path('/study-groups/' + $routeParams.id + '/' + $routeParams.key + '/pages/' + page.data.id);
      });
  }
});
