StudyGroupsApp.controller('ChatController', function($scope, $routeParams, $rootScope, Api){
  var socket = io();

  $scope.alertCounter = 0;

  socket.on('chat-message', function(message){
    $scope.$apply(function(){
      if(!$scope.chatIsShowing){
        $scope.alertCounter++;
      }

      $scope.messages.push(JSON.parse(message));
    });
  });

  Api.getChatMessages($routeParams.id)
    .then(function(messages){
      $scope.messages = messages.data;
    })

  $scope.toggleChat = function(){
    $scope.chatIsShowing = !$scope.chatIsShowing;

    if($scope.chatIsShowing){
      $scope.alertCounter = 0;
    }
  }

  $scope.sendChatMessage = function(){
    var messageToSend = { UserId: $rootScope.userSignedIn.id, createdAt: new Date(), StudyGroupId: $routeParams.id, text: $scope.newMessage, User: $rootScope.userSignedIn };

    socket.emit('chat-message', JSON.stringify(messageToSend));

    $scope.newMessage = '';
  }
});
