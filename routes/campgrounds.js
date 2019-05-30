const express     = require('express'),
      router      = express.Router(),
      Campground  = require('../models/campground');

//check if user is logged in - middleware
const isLoggedIn = (req, res, next) => {
  if(req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

//INDEX
router.get('/campgrounds', (req, res) => {
  //Get all campgrounds from db
  Campground.find({}, (err, Campgrounds) => {
    if(err) {
      console.log(err);
    } else {
      console.log('successfully showing data');
      res.render('campgrounds/index', {campgrounds: Campgrounds});
    }
  })
});

//SHOW
router.get('/campgrounds/:id', (req, res) => {
  //find the campground with given id and populate the actual comments for the ampground instead of ObjectId
  Campground.findById(req.params.id).populate("comments").exec((err, foundCampground) => {
    if(err) {
      console.log(err);
    } else {
      //render show template with that campground
      res.render('campgrounds/show', {campground: foundCampground});
    }
  });
});

//NEW
router.get('/campgrounds/new', isLoggedIn, (req, res) => {
  res.render('campgrounds/new');
});

//CREATE
router.post('/campgrounds', isLoggedIn, (req, res) => {
  const name = req.body.name;
  const image = req.body.image
  const description = req.body.description
  const author = {
    id: req.user._id,
    username: req.user.username
  }
  const newCampground = {name: name, image:image, description: description, author: author}
  //Create a new campground and save to db
  Campground.create(newCampground, (err, newCampground) => {
    if(err) {
      console.log(err);
    } else {
      console.log(`Successfully created ${newCampground.name} campground.`)
      res.redirect('/campgrounds')
    }
  })
});

//Edit
router.get('/campgrounds/:id/edit', (req, res) => {
  Campground.findById(req.params.id, (err, foundCampground) => {
    if(err) {
      res.redirect('/campgrounds')
    } else {
      res.render('campgrounds/edit', {campground: foundCampground});
    }
  })
});

//Update
router.put('/campgrounds/:id', (req, res) => {
  const campgroundUpdates = {
    name: req.body.name,
    image: req.body.image,
    description: req.body.description
  }
  Campground.findOneAndUpdate(req.params.id, campgroundUpdates, (err, updatedCampground) => {
    if(err) {
      console.log(err)
      res.redirect('/campgrounds')
    } else {
      res.redirect('/campgrounds/' + req.params.id);
    }
  })
})

module.exports = router;