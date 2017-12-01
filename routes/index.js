const express = require('express');
var exphbs = require('express-handlebars');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('index/welcome');
});

router.get('/dashboard', (req, res) => {
  res.render('index/dashboard');
});

router.get('/about', (req, res) => {
  res.render('index/about');
});

module.exports = router;
