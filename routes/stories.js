const express = require('express');
var exphbs = require('express-handlebars');
const { ensureAuthenticated, ensureGuest } = require('../helpers/auth');
const mongoose = require('mongoose');
const User = mongoose.model('users');
const Story = mongoose.model('stories');

const router = express.Router();

router.get('/', (req, res) => {
  Story.find({
    status: 'public'
  })
    .populate('user')
    .then(stories => {
      res.render('stories/index', {
        stories: stories
      });
    });
});

//Add Story Form
router.get('/add', ensureAuthenticated, (req, res) => {
  res.render('stories/add');
});

router.get('/show/:id', (req, res) => {
  Story.findOne({
    _id: req.params.id
  })
    .populate('user')
    .then(story => {
      res.render('stories/show', {
        story: story
      });
    });
});

//Process Add Story Form POST
router.post('/', (req, res) => {
  let allowComments;
  if (req.body.allowComments) {
    allowComments = true;
  } else {
    allowComments = false;
  }
  newStory = {
    title: req.body.title,
    status: req.body.staus,
    allowComments: allowComments,
    body: req.body.body,
    user: req.user.id
  };
  new Story(newStory).save().then(story => {
    res.redirect(`/stories/show/${story.id}`);
  });
});

router.get('/edit/:id', (req, res) => {
  Story.findOne({
    _id: req.params.id
  }).then(story => {
    res.render('stories/edit', {
      story: story
    });
  });
});

//Edit Story PUT
router.put('/:id', (req, res) => {
  Story.findOne({
    _id: req.params.id
  }).then(story => {
    let allowComments;
    if (req.body.allowComments) {
      allowComments = true;
    } else {
      allowComments = false;
    }

    //New Values
    story.title = req.body.title;
    story.status = req.body.status;
    story.body = req.body.body;
    story.allowComments = allowComments;

    story.save().then(story => {
      res.redirect('/dashboard');
    });
  });
});

//Delete Story
router.delete('/:id', (req, res) => {
  Story.remove({
    _id: req.params.id
  }).then(() => {
    res.redirect('/dashboard');
  });
});
module.exports = router;
