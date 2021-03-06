const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
var methodOverride = require('method-override');
const bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
const passport = require('passport');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const keys = require('./config/keys');

const app = express();

//method-override Middleware
app.use(methodOverride('_method'));
//BodyParser Middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

//Load Models
require('./models/User');
require('./models/Story');

//Handlebars helpers
const { truncate, stripTags, formatDate, select } = require('./helpers/hbs');

//Passport config
require('./config/passport')(passport);

//Handlebars middleware
app.engine(
  'handlebars',
  exphbs({
    helpers: {
      truncate: truncate,
      stripTags: stripTags,
      formatDate: formatDate,
      select: select
    },
    defaultLayout: 'main'
  })
);
app.set('view engine', 'handlebars');

//Load Routes
const auth = require('./routes/auth');
const index = require('./routes/index');
const stories = require('./routes/stories');

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
app.use('/', index);
app.use('/auth', auth);
app.use('/stories', stories);

//Static folder
app.use(express.static(path.join(__dirname, 'public')));

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server started at port ${port}...`);
});
