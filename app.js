const express       = require('express'),
      app           = express(),
      bodyParser    = require('body-parser'),
      mongoose      = require('mongoose'),
      passport      = require('passport'),
      LocalStrategy = require('passport-local'),
      User          = require('./models/user')
      seedDB        = require('./seeds');

const campgroundRoutes  = require('./routes/campgrounds'),
      commentRoutes     = require('./routes/comments'),
      indexRoutes       = require('./routes/index');

mongoose.connect("mongodb://localhost/yelp_camp", { useNewUrlParser: true });
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(__dirname + '/public'));
// seedDB();

//Passport configuartion 
app.use(require('express-session')({
  secret: "kuji",
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//This code is to have access to currentUser in all views instead of declaring it in each one.
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

app.use(indexRoutes)
app.use(campgroundRoutes)
app.use(commentRoutes)

app.listen(3000, console.log('YelpCamp has started!'));