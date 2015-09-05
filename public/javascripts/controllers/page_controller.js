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

  $scope.highlight = function(type){
    if($scope.currentlyHighlightedSection && $scope.currentlyHighlightedSection.split(' ').length >= 3){
      var highlight = { type: type, text: _.trim($scope.currentlyHighlightedSection) };

      Api.createHighlight(_.extend(highlight, { PageId: $routeParams.pageId }));

      $scope.page.Highlights.push(highlight);
    }
  }

  $scope.removeHighlightings = function(){
    if(confirm('Are you sure you wan\'t to remove all highlightings?')){
      Api.removeHighlightings($routeParams.pageId)
        .then(function(){
          $scope.page.Highlights = [];
        });
    }
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
