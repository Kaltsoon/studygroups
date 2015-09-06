StudyGroupsApp.service('SocketIo', function(){
  var socket = io();

  this.on = function(type, callback){
    socket.on(type, callback);
  }

  this.emit = function(type, content){
    socket.emit(type, content);
  }
});
