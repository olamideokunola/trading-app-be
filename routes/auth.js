var express = require('express');
var router = express.Router();

var passport = require('passport')
var { User, Role } = require('../db/models'),
  LocalStrategy = require('passport-local').Strategy;

var BearerStrategy = require('passport-http-bearer').Strategy;

var bcrypt = require('bcrypt')

var send2FaCode = require('../mailer/emailNotification')

let email = 'admin@mail.com'
let password = 'allow'

var jwt = require("jsonwebtoken");
const { authJwt } = require("../middleware");
const config = require("../config/auth.config");

let CreateUser = require('../usecases/RegisterUser')

function strategy () {
    
  console.log('in strategy')
    
  // local strategy
  passport.use(new LocalStrategy(

    async function(username, password, done) {
      // send2FaCode()
      console.log(`email is ${username}`)

      let query = {
        attributes: ['id', 'email', 'country', 'password', 'changePassword'],
        where: {
            email: username
        }
      } 

      User.findOne(query)
      .then(user => {
        try {
          if(user === null) {
            console.log('user is null ...')
            return done(null, false)        
          } else {
            console.log('user found ...')
            console.log(`user is:`)
            console.log(user.toJSON())

            bcrypt.compare(password, user.password).then((result) => {
              // result == true
              console.log(`${result ? 'Password match!' : 'Password mismatch!'}`)
              if(result) { 
                console.log(`No error, result is: ${result}`)
                return done(null, user)
              } else { 
                console.log(`Error found result is: ${result}`)
                return done(null, false)
              }
            });
          }
        } catch(e) {
          console.log(`error: ${e}`)
          return done(e)
        }      
      });
    }
  ));

  // bearer strategy
  passport.use(new BearerStrategy(
    async function(token, done) {

      try{
        console.log(`bearer token is ${token}`)

        // Try to retrieve a user with the token
        const user = await getUserFromToken(token);
        
        if (!user) { return done(null, false); }

        console.log(`user email is ${user.email}`)
        console.log(user)
        
        return done(null, user, { scope: 'all' });
      } catch (err) {

        return done(err)
        
      }

      // User.findOne({ token: token }, function (err, user) {
      //   if (err) { return done(err); }
      //   if (!user) { return done(null, false); }
      //   return done(null, user, { scope: 'all' });
      // });
    }
  ));
}

router.post('/', 
  [ 
    passport.authenticate('local', { failureRedirect: '/login', session: false }),
  ],
  async function(req, res) {
    console.log(`In auth, \n${Object.keys(req)}`)   
    console.log(`\n${Object.keys(req.headers)}`)
    //console.log(`\n${Object.keys(req.cookies)}`)

    let userData = await getUserRelatedData(req.user)

    // create token
    var token = jwt.sign({ id: userData.id, email: userData.email, country: userData.country, isAdmin: userData.isAdmin, roles: userData.roles, changePassword: userData.changePassword }, config.secret, {
      expiresIn: 86400 // 24 hours
    });

    console.log(`in post, \n${req.headers.authorization}`) 
    res.json({ accessToken: token });      
    // res.json({ user: req.user, accessToken: token });
});

router.post('/new', 
  [ 
    passport.authenticate('bearer', { failureRedirect: '/login', session: false }),
  ],
  function(req, res) {
    let userRepository = req.container.resolve('userRepository')
    let createUser = new CreateUser(userRepository)
    createUser({...req.body})
    .then(user => {
      res.json(user);
    })
});

router.get('/',   function(req, res) {
    // If this function gets called, authentication was successful.
    // `req.user` contains the authenticated user.
    console.log(req.user)
    res.send('login failed!')
  }
);

verifyAsync = async (token, user) => {
  jwt.verify(token.split(' ')[1], config.secret, async (err, decoded) => {
    console.log(`about to verify`)
    if (err) {
      console.log(`about to verify, error found`)
      console.log(err)
      return
    }
    
    if(decoded.id) {
      console.log(`verification done, about to get user`)
      User.findOne({
        attributes: ['id', 'email', 'country', 'password'],
        where: {
          id: decoded.id
        }
      })
      .then(result => {
        user = result
        console.log(`user gotten, user is ${user}`)
      })
    }  
  });
}

verify = async (token) => {
  
  try {

    let decoded = token.split(' ').length === 2 ? jwt.verify(token.split(' ')[1], config.secret) : jwt.verify(token, config.secret)

    console.log(`about to verify`)
    
    let user

    if(decoded.id) {
      
      console.log(`verification done, about to get user`)

      user = await User.findOne({
        attributes: ['id', 'email', 'country', 'password'],
        where: {
          id: decoded.id
        }
      })

      console.log(`user gotten, user is ${user.toJSON()}`)
      let roles = await user.getRoles()
      console.log(`user gotten, user roles are ${roles.map(role => Object.keys(role.toJSON()))}`)
      //console.log(await user.getRoles())

      return user
    }  

  } catch(err) {
    console.log(`about to verify, but error found`)
    console.log(err)
  }
}

getUserFromToken = async (token) => {

  try {
    
    let user = await verify(token)
    console.log(`verify complete`)

    let userData = await getUserRelatedData(user)
    
    return userData

  } catch (e) {
    console.error(e)
    return {}
  }
  
}

getUserRelatedData = async (user) => {

  let roles = (await user.getRoles()).map(role => {
    console.log(`in getUserRelatedData, role is ${role.toJSON().name}`)
    return role.toJSON().name
  })

  let isAdmin = roles.find(role => role === 'admin') ? true : false

  console.log(`in getUserRelatedData roles are ${roles}`)
  console.log(`user is:`)
  console.log(user)
  console.log(`user change password flag is ${user.changePassword}`)

  return {
    id: user.id,
    email: user.email,
    country: user.country,
    roles,
    isAdmin,
    changePassword: user.changePassword
  }
}
module.exports = { passport, router, strategy, getUserFromToken };