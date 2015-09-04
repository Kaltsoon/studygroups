StudyGroupsApp.controller('CreatePageController', function($scope, $location, $routeParams, Api){
  $scope.newPage = {};

  Api.getStudyGroup($routeParams.id, $routeParams.key)
    .then(function(group){
      $scope.group = group.data;
    });

  $scope.createPage = function(){
    $scope.newPage.StudyGroupId = $routeParams.id;

    Api.createPage($scope.newPage)
      .then(function(page){
        $location.path('/study-groups/' + $routeParams.id + '/' + $routeParams.key + '/pages/' + page.data.id);
      });
  }
});
