const express = require('express');
const router = express.Router();
const auth = require('../services/auth');
const User = require('../models/User');
const bcrypt = require('bcrypt');

router.get('/', auth.verifyToken, (req, res) => {
  res.render('index', { user: req.user });
});

router.get('/admin', auth.verifyToken, auth.authorize('admin'), (req, res) =>{
  res.render('admin', { user: req.user });
})

router.get('/signup', (req, res) => {
  res.render('signup');
});

router.post('/signup', async (req, res) => {
  const { username, password, role } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ username, password : hashedPassword , role });
    const token = auth.generateToken({ username, role });
    console.log("token", token)
    console.log('User created:', user);
    res.cookie('token', token);
    res.redirect('/');
  } catch (error) {
    console.error(error);
    res.redirect('/signup');
  }
});

router.get('/login', (req, res) => {
  res.render('login');
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });

  if (user) {
    const passwordMatch = await bcrypt.compare(password, user.password);
    
    if(passwordMatch){
      const token = auth.generateToken({ username, role: user.role });
      console.log("token", token)
      console.log('Login successful:', user);
      res.cookie('token', token);
      res.redirect('/');
    }
  } else {
    console.log('Login failed');
    res.redirect('/login');
  }
});


router.get('/logout', (req, res) => {
    res.clearCookie('token')
    res.redirect('/');
});

module.exports = router;