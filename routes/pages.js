var express = require('express');
var router = express.Router();
var StudyGroup = require('../models').StudyGroup;
var Page = require('../models').Page;
var User = require('../models').User;

router.get('/:id', function(req, res, next){
  Page.findOne({
    where: { id: req.params.id },
    include: { model: StudyGroup, include: [{ model: Page, attributes: ['title', 'id', 'StudyGroupId'] }, { model: User, attributes: ['id'] }] }
  })
    .then(function(page){
      res.json(page);
    });
});

router.post('/:id/remove', function(req, res, next) {
  Page.destroy({ where: { id: req.params.id }})
    .then(function(){
      res.sendStatus(200);
    });
});

router.post('/:id/update', function(req, res, next) {
  var editedPage = req.body;

  Page.update(editedPage, { where: { id: req.params.id }})
    .then(function(){
      res.sendStatus(200);
    });
});

router.post('/create', function(req, res, next) {
  var newPage = req.body;

  Page.create(newPage)
    .then(function(createdPage){
      res.json(createdPage);
    });
});

module.exports = router;
