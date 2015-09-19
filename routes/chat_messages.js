var express = require('express');
var router = express.Router();
var auth = require('../utils/authentication');
var ChatMessage = require('../models').ChatMessage;
var User = require('../models').User;

router.get('/from-group/:id', auth.confirmUserSignedIn, function(req, res, next){
  ChatMessage.findAll({
    where: { StudyGroupId: req.params.id },
    include: { model: User, attributes: ['id', 'username', 'email'] },
    order: [['createdAt', 'DESC']],
    limit: 80
  })
    .then(function(messages){
      res.json(messages);
    })
});

router.post('/:id/remove', auth.confirmUserSignedIn, auth.confirmStudyGroupOwnerOfChatMessage, function(req, res, next){
  ChatMessage.destroy({ where: { id: req.params.id } })
    .then(function(){
      res.sendStatus(200);
    });
});

module.exports = router;
