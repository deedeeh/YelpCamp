const express     = require('express'),
      router      = express.Router(),
      Campground  = require('../models/campground');

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

router.get('/campgrounds/new', (req, res) => {
  res.render('campgrounds/new');
});

router.post('/campgrounds', (req, res) => {
  const name = req.body.name;
  const image = req.body.image
  const description = req.body.description
  const newCampground = {name: name, image:image, description: description}
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

//show more info about a campground
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

//check if user is logged in
const isLoggedIn = (req, res, next) => {
  if(req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

module.exports = router;