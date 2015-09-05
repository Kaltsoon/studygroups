var express = require('express');
var router = express.Router();
var auth = require('../utils/authentication');
var Highlight = require('../models').Highlight;

router.post('/create', auth.confirmUserSignedIn, function(req, res, next) {
  var newHighlight = req.body;
  newHighlight.UserId = req.session.userId;

  Highlight.create(newHighlight)
    .then(function(createdHighlight){
      res.json(createdHighlight);
    });
});

router.post('/remove-all/:id', auth.confirmUserSignedIn, auth.confirmPageOwner, function(req, res, next){
  Highlight.destroy({ where: { PageId: req.params.id } })
    .then(function(){
      res.sendStatus(200);
    });
});

module.exports = router;
