const express = require('express');
const router = express.Router();
const Product = require('../models/product');

// Dynamic category route
router.get('/:categoryName', async (req, res) => {
  try {
    const products = await Product.find({ category: req.params.categoryName });
    res.render('category', { products, categoryName: req.params.categoryName });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;