describe('CommentsController', function(){
  var controller, scope, apiMock, routeParamsMock, rootScopeMock;

  beforeEach(function(){
    module('StudyGroupsApp');

    routeParamsMock = {
      pageId: 1
    }

    rootScopeMock = {
      userSignedIn: { username: 'kalle', id: 1 }
    }

    apiMock = {
      getComments: function(id){
        return {
          then: function(callback){ callback({ data: [{ content: 'Lorem ipsum', id: 1, replies: [{ content: 'Dolor sit amet', id: 2 }] }] }) }
        }
      },
      createComment: function(comment){
        return {
          then: function(callback){
            comment.id = 1;
            callback({ data: comment });

            return {
              catch: function(callback){ callback(); }
            }
          }
        }
      },
      removeComment: function(id){
        return {
          then: function(callback){ callback() }
        }
      },
      updateComment: function(comment){
        return {
          then: function(callback){ callback() }
        }
      }
    }

    spyOn(apiMock, 'getComments').and.callThrough();
    spyOn(apiMock, 'createComment').and.callThrough();
    spyOn(apiMock, 'removeComment').and.callThrough();
    spyOn(apiMock, 'updateComment').and.callThrough();
    spyOn(window, 'confirm').and.returnValue(true);

    inject(function($controller, $rootScope) {
      scope = $rootScope.$new();
      controller = $controller('CommentsController', {
        $scope: scope,
        $routeParams: routeParamsMock,
        $rootScope: rootScopeMock,
        Api: apiMock
      });
    });
  });

  it('should be able to display comments', function(){
    expect(apiMock.getComments).toHaveBeenCalledWith(1);
    expect(scope.comments).toBeDefined();
  });

  it('should have the right comment count', function(){
    scope.$apply();
    expect(scope.commentCount).toBe(2);
  });

  it('should be able to create a comment', function(){
    scope.newComment = 'Jees, jees!';
    scope.addComment();

    expect(apiMock.createComment).toHaveBeenCalled();

    scope.$apply();

    expect(scope.commentCount).toBe(3);
  });

  it('should be able to remove a comment', function(){
    var toBeRemoved = scope.comments[0].replies[0];

    scope.removeComment(toBeRemoved);

    expect(toBeRemoved.removed).toBeTruthy();
    expect(apiMock.removeComment).toHaveBeenCalledWith(toBeRemoved.id);

    scope.$apply();

    expect(scope.commentCount).toBe(1)
  });

  it('should not count replies of a removed comment', function(){
    var toBeRemoved = scope.comments[0];

    scope.removeComment(toBeRemoved);
    scope.$apply();

    expect(scope.commentCount).toBe(0);
  });

  it('should be able to update a comment', function(){
    var toBeEdited = scope.comments[0];

    toBeEdited.editedContent = 'Muokkaus';

    scope.updateComment(toBeEdited);

    expect(toBeEdited.content).toEqual('Muokkaus');
    expect(apiMock.updateComment).toHaveBeenCalled();
  });

  it('should be able to add a reply to a comment', function(){
    var toReply = scope.comments[0];

    scope.addReply(toReply, 'Jou!');
    scope.$apply();

    expect(scope.comments[0].replies.length).toBe(2);
    expect(scope.commentCount).toBe(3);
    expect(apiMock.createComment).toHaveBeenCalled();
  });
});
