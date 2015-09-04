var express = require('express');
var _ = require('lodash');
var router = express.Router();
var auth = require('../utils/authentication');
var StudyGroup = require('../models').StudyGroup;
var Page = require('../models').Page;
var User = require('../models').User;
var Reader = require('../models').Reader;

router.get('/', auth.confirmUserSignedIn, function(req, res, next) {
  StudyGroup.findAll({
    where: { UserId: req.session.userId },
    include: [{ model: Page, attributes: ['title', 'id'] }, { model: User }, { model: Reader, attributes: ['UserId'] }]
  })
    .then(function(groups){
      res.json(groups);
    })
});

router.get('/plaa', function(req, res, next){
  Reader.findAll()
    .then(function(readers){
      res.json(readers);
    });
});

router.get('/:id/:key', function(req, res, next){
  StudyGroup.findOne({
    where: { id: req.params.id, key: req.params.key },
    include: [{ model: Page, attributes: ['title', 'id'] }, { model: User }, { model: Reader, include: { model: User }}]
  })
    .then(function(group){
      if(group){
        Reader.create({
            UserId: req.session.userId,
            StudyGroupId: req.params.id,
            identifier: req.session.userId + '#' + req.params.id
        });

        res.json(group);
      }else{
        res.sendStatus(404);
      }
    });
});

router.get('/:id/pages/:pageId', function(req, res, next){
  Page.findOne({
    where: { id: req.params.pageId },
    include: { model: StudyGroup, include: { model: Page, attributes: ['title', 'id'] } }
  })
    .then(function(page){
      res.json(page);
    });
});

router.post('/create', auth.confirmUserSignedIn, function(req, res, next){
  var newGroup = req.body;
  newGroup.UserId = req.session.userId;
  newGroup.key = Math.random().toString(36).slice(2);

  StudyGroup.create(newGroup)
    .then(function(createdGroup){
      res.json(createdGroup);
    });
});

router.post('/:id/remove', function(req, res, next){
  Page.destroy({ where: { StudyGroupId: req.params.id } });

  StudyGroup.destroy({ where: { id: req.params.id } })
    .then(function(){
      res.sendStatus(200);
    });
});

router.post('/:id/update', function(req, res, next){
  var editedGroup = req.body;

  StudyGroup.update(editedGroup, { where: { id: req.params.id } })
    .then(function(){
      res.sendStatus(200);
    });
});

module.exports = router;
