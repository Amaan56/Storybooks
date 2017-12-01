const express = require('express');
var exphbs = require('express-handlebars');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('index');
});

router.get('/dashboard', (req, res) => {
  res.send('Dashboard');
});

module.exports = router;
