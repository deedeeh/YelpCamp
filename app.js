const express = require('express');
const app = express();
const bodyParser = require('body-parser')

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static('./public'));

let campgrounds = [
  {name: 'Hendra Holiday Park', image: 'https://images.campsites.co.uk/campsite/15273/592ac637-fb1e-4846-b4ac-f70b8ec2ee6c/840/473/either/camping.jpg'},
  {name: 'Cheglinch Farm Glamping', image: 'https://images.campsites.co.uk/campsite/28020/6d041261-9288-47c0-b463-517d2efaf2a5/840/473/either/beautiful-furnished-lotus-bell.jpg'},
  {name: 'New Beach Holiday Park', image: 'https://images.campsites.co.uk/campsite/22264/86503143-379c-409a-8877-12c8f1b5b6ce/840/473/either/new-beach-holiday-park.jpg'}
]

app.get('/', (req, res) => {
  res.render('landing');
});

app.get('/campgrounds', (req, res) => {
  res.render('campgrounds', {camps: campgrounds});
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