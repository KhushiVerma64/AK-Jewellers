require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');
const dotenv = require('dotenv');
const path = require('path');
require('./config/passport')(passport);
const Product = require('./models/product');
const User = require('./models/user');
const LocalStrategy = require('passport-local').Strategy;
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const methodOverride = require('method-override');

const app = express();


app.use(methodOverride('_method'));

// Make user available in all EJS templates
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

// MongoDB Connection
mongoose.connect( process.env.MONGODB_URI,  {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// Passport Config
require('./config/passport')(passport);

// Middleware
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));

// Sessions
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use('/auth', authRoutes); 

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use('/products', productRoutes);


// Flash Messages
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error'); 
  res.locals.user = req.user || null;
  next();
});


// Routes
app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth'));

app.use('/', require('./routes/auth'));
app.use('/products', require('./routes/products'));

const categoryRoutes = require('./routes/category');
app.use('/category', categoryRoutes);

app.get('/', (req, res) => {
  res.render('home');
});


app.get('/gallery', async (req, res) => {
  try {
    const products = await Product.find();
    res.render('gallery', { user: req.user, products });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

app.get('/contact', (req, res) => {
  res.render('contact');
});

// Port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
