const express   = require('express'),
      router    = express.Router(),
      passport  = require('passport'),
      User      = require('../models/user');

router.get('/', (req, res) => {
  res.render('landing');
});

//AUTH ROUTES
//show register form
router.get('/register', (req, res) => {
  res.render('register')
});

//sign up logic
router.post('/register', (req, res) => {
  const newUser = new User({username: req.body.username});
  User.register(newUser, req.body.password, (err, user) => {
    if(err) {
      console.log(err)
      return res.render('register')
    }
    passport.authenticate('local')(req, res, () => {
      res.redirect('/campgrounds');
    })
  });
});

//show login form
router.get('/login', (req, res) => {
  res.render('login');
})

//login logic
router.post('/login', passport.authenticate('local', {
  successRedirect: '/campgrounds',
  failureRedirect: '/login'
}), (req, res) => {
});

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/campgrounds');
});

//check if user is logged in
const isLoggedIn = (req, res, next) => {
  if(req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

module.exports = router;