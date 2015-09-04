StudyGroupsApp.controller('PageController', function($scope, $location, $routeParams, Api){
  $scope.editedPage = {}

  Api.getPage($routeParams.pageId)
    .then(function(page){
      $scope.page = page.data;
      $scope.editedPage = _.pick($scope.page, 'title', 'content', 'id');
    })
    .catch(function(){
      $location.path('/study-groups');
    });

  $scope.toggleEditing = function(){
    $scope.isEditing = !$scope.isEditing;
  }

  $scope.updatePage = function(){
    Api.updatePage($scope.editedPage)
      .then(function(){
        $scope.isEditing = false;
        _.extend($scope.page, $scope.editedPage);
      });
  }

  $scope.removePage = function(){
    if(confirm('Are you sure you wan\'t to remove this page?')){
      Api.removePage($routeParams.pageId)
        .then(function(){
          $location.path('/study-groups/' + $routeParams.groupId + '/' + $routeParams.key);
        });
    }
  }
});
