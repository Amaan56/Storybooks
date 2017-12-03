const express = require('express');
var exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const { ensureAuthenticated, ensureGuest } = require('../helpers/auth');
const router = express.Router();

const Story = mongoose.model('stories');

router.get('/', ensureGuest, (req, res) => {
  res.render('index/welcome');
});

router.get('/dashboard', ensureAuthenticated, (req, res) => {
  Story.find({
    user: req.user.id
  }).then(stories => {
    res.render('index/dashboard', {
      stories: stories
    });
  });
});

router.get('/about', (req, res) => {
  res.render('index/about');
});

module.exports = router;
