const User = require('../models/user')
const jwt = require('jwt-simple')
const config = require('../config')

// https://jwt.io/
function tokenForUser(user) {
  const timestamp = new Date().getTime()
  return jwt.encode({ sub: user.id, iat: timestamp }, config.secret)
}

exports.signin = function(req, res, next) {
  // User has already their email and password auth'd
  //just need to give them a token
  res.send({token: tokenForUser(req.user)})
}

exports.signup  = function(req, res, next) {
  const email = req.body.email
  const password = req.body.password

  if(!email || !password) {
    return res.status(422).send({error: 'you must provide an email and a' +
        ' password'})
  }
  // if a user with a given email exists
  User.findOne({ email: email}, function(err, exisitingUser) {
    if(err) { return next(err)}
    // if a user with email does exist, return an error
    if(exisitingUser) {
      return res.status(422).send({error: 'Email is in use'})
    }
    //if a user with email does NOT exist, create and save user record
    const user = new User({
      email: email,
      password: password
    })

    user.save(function(err) {
      if(err) { return next(err)}
      //respond to request indicated the user was created
      res.json({token: tokenForUser(user)})
    })
  })



}