StudyGroupsApp.controller('ChatController', function($scope, $routeParams, $rootScope, Api, SocketIo){
  $scope.alertCounter = 0;

  SocketIo.on('chat-message', function(message){
    var currentGroupId = $routeParams.id || $routeParams.groupId;
    var parsedMessage = JSON.parse(message);

    if(parsedMessage.StudyGroupId != currentGroupId){
      return;
    }

    $scope.$apply(function(){
      if(!$scope.chatIsShowing){
        $scope.alertCounter++;
      }

      $scope.messages.push(parsedMessage);
    });
  });

  Api.getChatMessages($routeParams.id || $routeParams.groupId)
    .then(function(messages){
      $scope.messages = messages.data;
    })

  $scope.removeChatMessage = function(message){
    if(confirm('Are you sure you wan\'t to remove this message?')){
      Api.removeChatMessage(message.id)
        .then(function(){
          message.removed = true;
        });
    }
  }

  $scope.toggleChat = function(){
    $scope.chatIsShowing = !$scope.chatIsShowing;

    if($scope.chatIsShowing){
      $scope.alertCounter = 0;
    }
  }

  $scope.sendChatMessage = function(){
    if($scope.newMessage){
      var messageToSend = { UserId: $rootScope.userSignedIn.id, createdAt: new Date(), StudyGroupId: $routeParams.id || $routeParams.groupId, text: $scope.newMessage, User: $rootScope.userSignedIn };

      SocketIo.emit('chat-message', JSON.stringify(messageToSend));

      $scope.newMessage = '';
    }
  }
});
