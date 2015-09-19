var StudyGroup = require('../models').StudyGroup;
var Page = require('../models').Page;
var ChatMessage = require('../models').ChatMessage;
var Comment = require('../models').Comment;

function confirmUserSignedIn(req, res, next){
  if(req.session.userId){
    next();
  }else{
    res.sendStatus(403);
  }
}

function confirmRightUser(req, res, next){
  if(req.params.id == req.session.userId){
    next();
  }else{
    res.sendStatus(403);
  }
}

function confirmStudyGroupOwner(req, res, next){
  var groupId = req.params.id || req.body.StudyGroupId;

  StudyGroup.findOne({ where: { id: groupId } })
    .then(function(group){
      if(!group || group.UserId != req.session.userId){
        res.sendStatus(403);
      }else{
        next();
      }
    });
}

function confirmPageOwner(req, res, next){
  Page.findOne({
    where: { id: req.params.id },
    include: { model: StudyGroup, attributes: ['UserId'] }
  })
    .then(function(page){
      if(!page || page.StudyGroup.UserId != req.session.userId){
        req.sendStatus(403);
      }else{
        next();
      }
    });
}

function confirmStudyGroupOwnerOfChatMessage(req, res, next){
  ChatMessage.findOne({
    where: { id: req.params.id },
    include: { model: StudyGroup }
  })
    .then(function(message){
      if(!message || !message.StudyGroup || message.StudyGroup.UserId != req.session.userId){
        res.sendStatus(403);
      }else{
        next();
      }
    });
}

function confirmCommentOwner(req, res, next){
  Comment.findOne({ where: { id: req.params.id } })
    .then(function(comment){
      if(!comment || comment.UserId != req.session.userId){
        res.sendStatus(403);
      }else{
        next();
      }
    });
}

function confirmStudyGroupOwnerOrOwnerOfComment(req, res, next){
  Comment.findOne({
    where: { id: req.params.id },
    include: { model: Page, attributes: ['id'], include: { model: StudyGroup, attributes: ['UserId'] }  }
  })
    .then(function(comment){
      if(comment && ( comment.Page.StudyGroup.UserId == req.session.userId || comment.UserId == req.session.userId )){
        next();
      }else{
        res.sendStatus(403);
      }
    });
}

module.exports = {
  confirmUserSignedIn: confirmUserSignedIn,
  confirmStudyGroupOwner: confirmStudyGroupOwner,
  confirmPageOwner: confirmPageOwner,
  confirmRightUser: confirmRightUser,
  confirmCommentOwner: confirmCommentOwner,
  confirmStudyGroupOwnerOrOwnerOfComment: confirmStudyGroupOwnerOrOwnerOfComment,
  confirmStudyGroupOwnerOfChatMessage: confirmStudyGroupOwnerOfChatMessage
}
