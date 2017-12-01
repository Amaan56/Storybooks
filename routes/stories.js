const express = require('express');
var exphbs = require('express-handlebars');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('stories/index');
});

router.get('/add', (req, res) => {
  res.render('stories/add');
});

router.get('/show', (req, res) => {
  res.render('stories/show');
});

module.exports = router;
