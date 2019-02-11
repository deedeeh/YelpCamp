const express = require('express');
const app = express();

app.set('view engine', 'ejs');

app.use(express.static('./public'));

app.get('/', (req, res) => {
  res.render('landing');
});

app.get('/campgrounds', (req, res) => {
  const campgrounds = [
    {name: 'Hendra Holiday Park', image: 'https://images.campsites.co.uk/campsite/15273/592ac637-fb1e-4846-b4ac-f70b8ec2ee6c/840/473/either/camping.jpg'},
    {name: 'Cheglinch Farm Glamping', image: 'https://images.campsites.co.uk/campsite/28020/6d041261-9288-47c0-b463-517d2efaf2a5/840/473/either/beautiful-furnished-lotus-bell.jpg'},
    {name: 'New Beach Holiday Park', image: 'https://images.campsites.co.uk/campsite/22264/86503143-379c-409a-8877-12c8f1b5b6ce/840/473/either/new-beach-holiday-park.jpg'}
  ]
  res.render('campgrounds');
});

app.listen(3000, console.log('YelpCamp has started!'));