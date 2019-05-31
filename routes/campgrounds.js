const express     = require('express'),
      router      = express.Router(),
      Campground  = require('../models/campground');

//MIDDLEWARE     
//check if user is logged in - middleware
const isLoggedIn = (req, res, next) => {
  if(req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

//check if user is authorised 
const checkCampgroundOwnership = (req, res, next) => {
  if(req.isAuthenticated()) {
    Campground.findById(req.params.id, (err, foundCampground) => {
      if(err) {
        res.redirect('back')
      } else {
        //does user own the campground?
        if(foundCampground.author.id.equals(req.user._id)) {
          next()
        } else {
          res.redirect('back');
        }
      }
    });
  } else {
    res.redirect('back');
  } 
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

//Edit
router.get('/campgrounds/:id/edit', checkCampgroundOwnership, (req, res) => {
  Campground.findById(req.params.id, (err, foundCampground) => {
    res.render('campgrounds/edit', {campground: foundCampground});
  });
});

//Update
router.put('/campgrounds/:id', checkCampgroundOwnership, (req, res) => {
  const campgroundUpdates = {
    name: req.body.name,
    image: req.body.image,
    description: req.body.description
  }
  Campground.findByIdAndUpdate(req.params.id, campgroundUpdates, (err, updatedCampground) => {
    if(err) {
      console.log(err)
      res.redirect('/campgrounds')
    } else {
      res.redirect('/campgrounds/' + req.params.id);
    }
  })
})

//Destroy 
router.delete('/campgrounds/:id', checkCampgroundOwnership, (req, res) => {
  Campground.findByIdAndRemove(req.params.id, err => {
    if(err) {
      console.log(err)
      res.redirect('/campgrounds');
    } else {
      res.redirect('/campgrounds');
    }
  })
});

module.exports = router;