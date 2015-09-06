describe('ChatController', function(){
  var controller, scope, apiMock, routeParamsMock, rootScopeMock, socketIoMock;

  beforeEach(function(){
    module('StudyGroupsApp');

    routeParamsMock = {
      id: 1
    }

    socketIoMock = {
      emit: function(type, content){},
      on: function(type, callback){}
    }

    rootScopeMock = {
      userSignedIn: { username: 'kalle', id: 1 }
    }

    apiMock = {
      getChatMessages: function(id){
        return {
          then: function(callback){ callback({ data: [{ text: 'Lorem ipdum' }, { text: 'Dolor sit amet' }] }) }
        }
      }
    }

    spyOn(apiMock, 'getChatMessages').and.callThrough();
    spyOn(socketIoMock, 'emit').and.callThrough();
    spyOn(socketIoMock, 'on').and.callThrough();

    inject(function($controller, $rootScope) {
      scope = $rootScope.$new();
      controller = $controller('ChatController', {
        $scope: scope,
        $routeParams: routeParamsMock,
        $rootScope: rootScopeMock,
        SocketIo: socketIoMock,
        Api: apiMock
      });
    });
  });

  it('should be able to display chat messages', function(){
    expect(apiMock.getChatMessages).toHaveBeenCalledWith(1);
    expect(scope.messages.length).toBe(2);
  });

  it('should be able to add a message with text', function(){
    scope.newMessage = 'Lorem ipsum';
    scope.sendChatMessage();

    expect(socketIoMock.emit).toHaveBeenCalled();
  });

  it('should not be able to add an empty message', function(){
    scope.newMessage = '';
    scope.sendChatMessage();

    expect(socketIoMock.emit).not.toHaveBeenCalled();
  });
});
