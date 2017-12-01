const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');

const app = express();

//Passport config
require('./config/passport')(passport);

//Load Routes
const auth = require('./routes/auth');

app.get('/', (req, res) => {
  res.send('It works');
});

app.use('/auth', auth);

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server started at port ${port}...`);
});
