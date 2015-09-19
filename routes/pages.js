var express = require('express');
var router = express.Router();
var auth = require('../utils/authentication');
var StudyGroup = require('../models').StudyGroup;
var Page = require('../models').Page;
var User = require('../models').User;
var Highlight = require('../models').Highlight;

router.get('/:id/:key', auth.confirmUserSignedIn, function(req, res, next){
  Page.findOne({
    where: { id: req.params.id },
    include: [{ model: StudyGroup, include: [{ model: Page, attributes: ['title', 'id'], include: { model: StudyGroup, attributes: ['key', 'id'] } }, { model: User, attributes: ['id'] }] }, { model: Highlight }]
  })
    .then(function(page){
      if(page.StudyGroup.key == req.params.key){
        res.json(page);
      }else{
        res.sendStatus(404);
      }
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
    })
    .catch(function(error){
      res.sendStatus(400);
    });
});

router.post('/create', auth.confirmUserSignedIn, auth.confirmStudyGroupOwner, function(req, res, next) {
  var newPage = req.body;

  Page.create(newPage)
    .then(function(createdPage){
      res.json(createdPage);
    })
    .catch(function(error){
      res.sendStatus(400);
    });
});

module.exports = router;
