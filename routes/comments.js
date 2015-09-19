var express = require('express');
var router = express.Router();
var auth = require('../utils/authentication');
var Comment = require('../models').Comment;
var User = require('../models').User;
var Page = require('../models').Page;
var StudyGroup = require('../models').StudyGroup;

function createCommentTree(comments){
  var addReplies = function(comment){
    comment.dataValues.replies = [];

    comments.forEach(function(c){
      if(c.dataValues.CommentId == comment.dataValues.id){
        comment.dataValues.replies.push(c);
      }
    });

    comment.dataValues.replies.forEach(function(reply){
      addReplies(reply);
    });
  }

  var rootComments = [];

  comments.forEach(function(c){
    if(!c.dataValues.CommentId){
      rootComments.push(c);
    }
  });

  rootComments.forEach(function(c){
    addReplies(c)
  });

  return rootComments;
}

router.get('/from-page/:id', auth.confirmUserSignedIn, function(req, res, next){
  Comment.findAll({
    where: { PageId: req.params.id },
    include: [{ model: User, attributes: ['id', 'username', 'email'] }, { model: Page, attributes: ['id'], include: { model: StudyGroup, attributes: ['UserId'] } }]
  })
    .then(function(comments){
      res.json(createCommentTree(comments));
    });
});

router.post('/create', auth.confirmUserSignedIn, function(req, res, next){
  var newComment = req.body;
  newComment.UserId = req.session.userId;

  Comment.create(newComment)
    .then(function(comment){
      res.json(comment);
    })
    .catch(function(error){
      res.sendStatus(400);
    });
});

router.post('/:id/update', auth.confirmUserSignedIn, auth.confirmCommentOwner, function(req, res, next){
  var editedComment = req.body;

  Comment.update({ content: editedComment.content }, { where: { id: req.params.id } })
    .then(function(){
      res.sendStatus(200);
    })
    .catch(function(error){
      res.sendStatus(400);
    });
});

router.post('/:id/remove', auth.confirmUserSignedIn, auth.confirmStudyGroupOwnerOrOwnerOfComment, function(req, res, next){
  Comment.destroy({ where: { id: req.params.id } })
    .then(function(){
      res.sendStatus(200);
    });
});

module.exports = router;
