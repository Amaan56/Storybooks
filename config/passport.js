const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const keys = require('./keys');

//Load User model
require('../models/User');
const User = mongoose.model('users');

module.exports = passport => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: keys.googleClientID,
        clientSecret: keys.googleClientSecret,
        callbackURL: '/auth/google/callback',
        proxy: true
      },
      (accessToken, refreshToken, profile, done) => {
        //console.log(accessToken);
        //console.log(profile);
        const image = profile.photos[0].value.substring(
          0,
          profile.photos[0].value.indexOf('?')
        );
        //console.log(image);
        const newUser = {
          googleID: profile.id,
          email: profile.emails[0].value,
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
          image: image
        };
        //Check for Existing User
        User.findOne({
          googleID: profile.id
        }).then(user => {
          if (user) {
            //User Already Exists
            done(null, user);
          } else {
            //console.log('Else working');
            new User(newUser).save().then(user => {
              done(null, user);
            });
          }
        });
      }
    )
  );
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });
};
