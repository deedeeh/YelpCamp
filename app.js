const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Campground = require('./models/campground');
const Comment = require('./models/comment');
const seedDB = require('./seeds')

mongoose.connect("mongodb://localhost/yelp_camp", { useNewUrlParser: true });
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(__dirname + '/public'));
seedDB();


app.get('/', (req, res) => {
  res.render('landing');
});

app.get('/campgrounds', (req, res) => {
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

app.get('/campgrounds/new', (req, res) => {
  res.render('campgrounds/new');
});

app.post('/campgrounds', (req, res) => {
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
app.get('/campgrounds/:id', (req, res) => {
  //find the campground with given id and populate the actual comments for the ampground instead of ObjectId
  Campground.findById(req.params.id).populate("comments").exec((err, foundCampground) => {
    if(err) {
      console.log(err);
    } else {
      //render show template with that campground
      res.render('campgrounds/show', {campground: foundCampground});
    }
  });

})

app.get('/campgrounds/:id/comments/new', (req, res) => {
  Campground.findById(req.params.id, (err, foundCampground) => {
    if(err) {
      console.log(err);
    } else {
      //render new comment form with passed campground data
      res.render("comments/new", {campground: foundCampground});
    }
  })
})

app.post('/campgrounds/:id/comments', (req, res) => {
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

app.listen(3000, console.log('YelpCamp has started!'));