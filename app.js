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
  image: String
});

const Campground = mongoose.model("Campground", campgroundSchema);

// Campground.create({
//   name: 'Hendra Holiday Park', 
//   image:
//   'https://images.campsites.co.uk/campsite/15273/592ac637-fb1e-4846-b4ac-f70b8ec2ee6c/840/473/either/camping.jpg'
// }, (err, campground) => {
//   if(err) {
//     console.log(err);
//   } else {
//     console.log('successfully created campground');
//     console.log(campground)
//   }
// })



// let campgrounds = [
//   {name: 'Hendra Holiday Park', image: 'https://images.campsites.co.uk/campsite/15273/592ac637-fb1e-4846-b4ac-f70b8ec2ee6c/840/473/either/camping.jpg'},
//   {name: 'Cheglinch Farm Glamping', image: 'https://images.campsites.co.uk/campsite/28020/6d041261-9288-47c0-b463-517d2efaf2a5/840/473/either/beautiful-furnished-lotus-bell.jpg'},
//   {name: 'New Beach Holiday Park', image: 'https://images.campsites.co.uk/campsite/22264/86503143-379c-409a-8877-12c8f1b5b6ce/840/473/either/new-beach-holiday-park.jpg'}
// ]

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
      res.render('campgrounds', {camps: Campgrounds});
    }
  })
});

app.get('/campgrounds/new', (req, res) => {
  res.render('new');
});

app.post('/campgrounds', (req, res) => {
  const name = req.body.name;
  const image = req.body.image
  campgrounds.push({name: name, image: image})
  res.redirect('/campgrounds')
});

app.listen(3000, console.log('YelpCamp has started!'));