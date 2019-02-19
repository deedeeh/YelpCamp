const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

mongoose.connect("mongodb://localhost/yelp_camp", { useNewUrlParser: true });

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static('./public'));

//mongoose Schema setup
const campgroundSchema = new mongoose.Schema({
  name: String,
  image: String,
  description: String
});

const Campground = mongoose.model("Campground", campgroundSchema);

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
      res.render('index', {campgrounds: Campgrounds});
    }
  })
});

app.get('/campgrounds/new', (req, res) => {
  res.render('new');
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
      console.log(`Successfully created ${name} campground.`)
      res.redirect('/campgrounds')
    }
  })
});

//show more info about a campground
app.get('/campgrounds/:id', (req, res) => {
  //find the campground with given id
  Campground.findById(req.params.id, (err, foundCampground) => {
    if(err) {
      console.log(err);
    } else {
      //render show template with that campground
      res.render('show', {campground: foundCampground});
    }
  });
  
  
})

app.listen(3000, console.log('YelpCamp has started!'));