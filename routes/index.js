var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  if(req.session.userId){
    res.render('index');
  }else{
    res.redirect('/welcome');
  }
});

router.get('/welcome', function(req, res, next){
  res.render('welcome', { signInError: false, signUpErrors: [], signInUsername: '', signUpUsername: '', signUpEmail: '' });
});

module.exports = router;
