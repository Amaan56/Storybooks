const express = require('express');
const passport = require('passport');
module.exports = {
  ensureAuthenticated: (req, res, next) => {
    if (!req.user) {
      res.redirect('/');
    } else {
      next();
    }
  },
  ensureGuest: (req, res, next) => {
    if (req.user) {
      res.redirect('/dashboard');
    } else {
      next();
    }
  }
};
