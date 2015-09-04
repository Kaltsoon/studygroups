var express = require('express');
var router = express.Router();
var auth = require('../utils/authentication');
var StudyGroup = require('../models').StudyGroup;
var Page = require('../models').Page;
var User = require('../models').User;

router.get('/:id', auth.confirmUserSignedIn, function(req, res, next){
  Page.findOne({
    where: { id: req.params.id },
    include: { model: StudyGroup, include: [{ model: Page, attributes: ['title', 'id', 'StudyGroupId'] }, { model: User, attributes: ['id'] }] }
  })
    .then(function(page){
      res.json(page);
    });
});

router.post('/:id/remove', auth.confirmUserSignedIn, auth.confirmPageOwner, function(req, res, next) {
  Page.destroy({ where: { id: req.params.id }})
    .then(function(){
      res.sendStatus(200);
    });
});

router.post('/:id/update', auth.confirmUserSignedIn, auth.confirmPageOwner, function(req, res, next) {
  var editedPage = req.body;

  Page.update(editedPage, { where: { id: req.params.id }})
    .then(function(){
      res.sendStatus(200);
    });
});

router.post('/create', auth.confirmUserSignedIn, auth.confirmStudyGroupOwner, function(req, res, next) {
  var newPage = req.body;

  Page.create(newPage)
    .then(function(createdPage){
      res.json(createdPage);
    });
});

module.exports = router;
