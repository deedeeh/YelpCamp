const express     = require('express'),
      router      = express.Router(),
      Campground  = require('../models/campground'),
      Comment     = require('../models/comment');

//check if user is logged in - middleware
const isLoggedIn = (req, res, next) => {
  if(req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

// NEW
router.get('/campgrounds/:id/comments/new', isLoggedIn, (req, res) => {
  Campground.findById(req.params.id, (err, foundCampground) => {
    if(err) {
      console.log(err);
    } else {
      //render new comment form with passed campground data and currentUser data
      res.render("comments/new", {campground: foundCampground});
    }
  })
})

// CREATE
router.post('/campgrounds/:id/comments', isLoggedIn, (req, res) => {
  //find campground by ID
  Campground.findById(req.params.id, (err, foundCampground) => {
    if(err) {
      console.log(err);
      res.redirect('/campgrounds');
    } else {
      const text = req.body.text;
      const author = req.body.author
      Comment.create({text: text, author: author}, (err, comment) => {
        if(err) {
          console.log(err)
        } else {
          //Add username and id to comment
          comment.author.id = req.user._id;
          comment.author.username = req.user.username
          //save comment
          comment.save();
          //connect the comment with campground
          foundCampground.comments.push(comment);
          foundCampground.save();
          //redirect to show campground
          res.redirect(`/campgrounds/${foundCampground._id}`)
        }
      })
    }
  })
});

module.exports = router;