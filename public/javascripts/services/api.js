StudyGroupsApp.service('Api', function($http){
  this.getUserSignedIn = function(){
    return $http.get('/users/user-signed-in');
  }

  this.getUser = function(username){
    return $http.get('/users/' + username);
  }

  this.updateUser = function(user){
    return $http.post('/users/' + user.id + '/update', user);
  }

  this.removeUser = function(id){
    return $http.post('/users/' + id + '/remove');
  }

  this.getChatMessages = function(groupId){
    return $http.get('/chat-messages/from-group/' + groupId);
  }

  this.getUsersStudyGroups = function(){
    return $http.get('/study-groups');
  }

  this.getStudyGroup = function(id, key){
    return $http.get('/study-groups/' + id + '/' + key);
  }

  this.createStudyGroup = function(studyGroup){
    return $http.post('/study-groups/create', studyGroup);
  }

  this.removeStudyGroup = function(id){
    return $http.post('/study-groups/' + id + '/remove');
  }

  this.updateStudyGroup = function(group){
    return $http.post('/study-groups/' + group.id + '/update', group);
  }

  this.getPage = function(id, key){
    return $http.get('/pages/' + id + '/' + key);
  }

  this.removePage = function(id){
    return $http.post('/pages/' + id + '/remove');
  }

  this.updatePage = function(page){
    return $http.post('/pages/' + page.id + '/update', page);
  }

  this.createPage = function(page){
    return $http.post('/pages/create', page);
  }

  this.createHighlight = function(highlight){
    return $http.post('/highlights/create', highlight);
  }

  this.removeHighlightings = function(pageId){
    return $http.post('/highlights/remove-all/' + pageId);
  }

  this.signOut = function(){
    return $http.post('/users/sign-out');
  }
});
