StudyGroupsApp.controller('CommentsController', function($scope, $rootScope, $routeParams, Api){

  function commentCount(comment){
    comment.replies = comment.replies || [];

    var count = comment.removed ? 0 : 1;

    comment.replies.forEach(function(reply){
      if(!reply.removed){
        count += commentCount(reply);
      }
    });

    return count;
  }

  function extendComment(comment, extender){
    _.extend(comment, extender(comment));

    if(!comment.replies){
      return;
    }

    comment.replies.forEach(function(c){
      extendComment(c, extender);
    });
  }

  Api.getComments($routeParams.pageId)
    .then(function(comments){
      $scope.comments = comments.data;
      $scope.comments.forEach(function(comment){
        extendComment(comment, function(comment){ return { editedContent: comment.content }; });
      });
    });


  $scope.toggleCommentEditForm = function(comment){
    comment.editFormIsShowing = !comment.editFormIsShowing;
  }

  $scope.toggleReplyForm = function(comment){
    comment.replyFormIsShowing = !comment.replyFormIsShowing;
  }

  $scope.updateComment = function(comment){
    comment.content = comment.editedContent;
    comment.editFormIsShowing = false;

    Api.updateComment({ content: comment.content, id: comment.id });
  }

  $scope.removeComment = function(comment){
    if(confirm('Are you sure you wan\'t to remove this comment?')){
      Api.removeComment(comment.id)
        .then(function(){
          comment.removed = true;
        });
    }
  }

  $scope.toggleCommentForm = function(){
    $scope.commentFormIsShowing = !$scope.commentFormIsShowing;
  }

  $scope.addComment = function(){
    var newComment = {
      PageId: $routeParams.pageId,
      content: $scope.newComment
    };

    Api.createComment(newComment)
      .then(function(c){
        var comment = c.data;
        comment.editedContent = comment.content;
        comment.User = $rootScope.userSignedIn;
        comment.replies = [];
        $scope.comments.push(comment);

        $scope.newComment = '';
        $scope.commentFormIsShowing = false;
      })
      .catch(function(){
        $rootScope.showInputError = true;
      });
  }

  $scope.addReply = function(commentToReply, newReply){
    var reply = {
      PageId: $routeParams.pageId,
      CommentId: commentToReply.id,
      content: newReply
    }

    Api.createComment(reply)
      .then(function(c){
        var comment = c.data;
        comment.User = $rootScope.userSignedIn;
        comment.editedContent = comment.content;
        commentToReply.replies.push(comment);
        commentToReply.replyFormIsShowing = false;

        $scope.newReply = '';
      });
  }

  $scope.$watch('comments', function(newComments){
    $scope.commentCount = commentCount({ replies: $scope.comments }) - 1;
  }, true);
});
