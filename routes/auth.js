const express = require('express');
const passport = require('passport');
const User = require('../models/user');
const router = express.Router();

// Signup
router.get('/signup', (req, res) => {
  res.render('signup');
});


router.post('/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const newUser = new User({ username, email });
    const registeredUser = await User.register(newUser, password);

    req.login(registeredUser, (err) => {
      if (err) return next(err);
      res.redirect('/');
    });

  } catch (err) {
    console.error(err);
    res.send('Signup error: ' + err.message);
  }
});


// Login
router.get('/login', (req, res) => {
  res.render('login');
});

router.post('/login', passport.authenticate('local', {
  successRedirect: '/gallery',
  failureRedirect: '/auth/login',
  failureFlash: true
}));

// Logout
router.get('/logout', (req, res) => {
  req.logout(() => {
    res.redirect('/auth/login');
  });
});


module.exports = router;