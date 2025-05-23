const Product = require('../models/product');
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('home', { user: req.user });
});


router.get('/gallery', async (req, res) => {
  const products = await Product.find();
   console.log(products.map(p => p.image)); //  Log to check paths
  res.render('gallery', { products });
});

module.exports = router;