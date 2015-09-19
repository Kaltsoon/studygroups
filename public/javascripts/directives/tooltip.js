StudyGroupsApp.directive('tooltip', function(){
  return {
    scope: {
      content: '='
    },
    restrict: 'A',
    link: function(scope, elem, attrs){
      scope.$watch('content', function(){
        $(elem).tooltip({ container: 'body', title: scope.content });
      });

      $(elem).on('click', function(){
        $(elem).tooltip('hide');
      });
    }
  };
});
