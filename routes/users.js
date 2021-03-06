var express = require('express');
var router = express.Router();
var auth = require('../utils/authentication');
var User = require('../models').User;

var hash = require('password-hash');

router.post('/sign-in', function(req, res, next){
  var username = req.body.username;
  var password = req.body.password;

  User.findOne({ where: { username: username }})
    .then(function(user){
      if(user == null || !hash.verify(password, user.password)){
        res.render('welcome', { signInError: true, signInUsername: username, signUpErrors: [], signInUsername: '', signUpEmail: '' });
      }else{
        req.session.userId = user.id;
        res.redirect('/');
      }
    });
});

router.get('/user-signed-in', function(req, res, next){
  if(!req.session.userId){
    res.json({})
  }

  User.findOne({ where: { id: req.session.userId } })
    .then(function(user){
      if(!user){
        res.json({});
      }else{
        res.json(user);
      }
    });
});

router.post('/sign-up', function(req, res, next){
  var newUser = {
    username: req.body.username,
    email: req.body.email,
    password: req.body.password
  };

  User.build(newUser).validate()
    .then(function(errors){
      var errors = errors || { errors: [] };
      if(newUser.password != req.body.passwordConfirmation){
        errors.errors.push({ message: 'Password didn\'t match the confirmation.' })
      }

      if(!errors || errors.errors.length == 0){
        console.log(newUser.password);
        newUser.password = hash.generate(newUser.password);

        User.create(newUser)
          .then(function(createdUser){
            req.session.userId = createdUser.id;
            res.redirect('/');
          });
      }else{
        res.render('welcome', { signUpErrors: errors.errors, signUpUsername: newUser.username, signUpEmail: newUser.email });
      }
    });
});

router.post('/sign-out', function(req, res, next){
  req.session.userId = null;

  res.sendStatus(200);
});

router.get('/:username', function(req, res, next){
  User.findOne({ where: { username: req.params.username }, attributes: ['username', 'email', 'id', 'createdAt', 'description'] })
    .then(function(user){
      res.json(user);
    });
});

router.post('/:id/update', auth.confirmUserSignedIn, auth.confirmRightUser, function(req, res, next){
  var editedUser = req.body;

  User.update(editedUser, { where: { id: req.params.id } })
    .then(function(){
      res.sendStatus(200);
    });
});

router.post('/:id/remove', auth.confirmUserSignedIn, auth.confirmRightUser, function(req, res, next){
  User.destroy({ where: { id: req.params.id } })
    .then(function(){
      req.session.userId = null;
      res.sendStatus(200);
    });
});

module.exports = router;
