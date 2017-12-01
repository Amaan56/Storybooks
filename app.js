const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const keys = require('./config/keys');

const app = express();

//Load User Model
require('./models/User');

//Passport config
require('./config/passport')(passport);

//Load Routes
const auth = require('./routes/auth');

//map global variables
mongoose.Promise = global.Promise;
//mongoose connect
mongoose
  .connect(keys.mongoURI, {
    useMongoClient: true
  })
  .then(() => {
    console.log('MongoDB Connected...');
  })
  .catch(err => console.log(err));

app.get('/', (req, res) => {
  res.send('It works');
});

//Cookie Parser Middleware
app.use(cookieParser());

//Express Session Middleware
app.use(
  session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
  })
);

//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

//Global variables
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  next();
});

//Route Handler
app.use('/auth', auth);

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server started at port ${port}...`);
});
