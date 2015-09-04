var StudyGroupsApp = angular.module('StudyGroupsApp', ['ngRoute', 'angularMoment', 'btford.markdown', 'ui.gravatar']);

StudyGroupsApp.config(function($routeProvider){
  function getUserSignedIn($rootScope, Api){
    return Api.getUserSignedIn()
      .then(function(user){
        $rootScope.userSignedIn = user.data.id ? user.data : null;
      });
  }

  $routeProvider
    .when('/study-groups', {
      templateUrl: '/javascripts/views/study_group_list.html',
      controller: 'StudyGroupListController',
      resolve: { userSignedIn: getUserSignedIn }
    })
    .when('/study-groups/:id/:key', {
      templateUrl: '/javascripts/views/study_group.html',
      controller: 'StudyGroupController',
      resolve: { userSignedIn: getUserSignedIn }
    })
    .when('/study-groups/:id/:key/new-page', {
      templateUrl: '/javascripts/views/new_page.html',
      controller: 'CreatePageController',
      resolve: { userSignedIn: getUserSignedIn }
    })
    .when('/study-groups/:groupId/:key/pages/:pageId', {
      templateUrl: '/javascripts/views/page.html',
      controller: 'PageController',
      resolve: { userSignedIn: getUserSignedIn }
    })
    .otherwise({
      redirectTo: '/study-groups'
    });
});

StudyGroupsApp.run(function($rootScope, Api){
  $rootScope.signOut = function(){
    Api.signOut()
      .then(function(){
        window.location.href = '/welcome';
      })
  }
});
