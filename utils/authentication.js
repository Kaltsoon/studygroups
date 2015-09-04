function confirmUserSignedIn(req, res, next){
  if(req.session.userId){
    next()
  }else{
    res.sendStatus(403);
  }
}

module.exports = {
  confirmUserSignedIn: confirmUserSignedIn
}
