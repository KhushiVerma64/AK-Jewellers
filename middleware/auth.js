const Product = require('../models/product'); 

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  res.redirect('/auth/login');
};

// Middleware to check if user is the owner of the product
const isOwner = async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return res.status(404).send("Product not found");
  }
  if (!product.createdBy.equals(req.user._id)) {
    return res.status(403).send("You don't have permission");
  }
  next();
};

// Export both functions 
module.exports = {
  isAuthenticated,
  isOwner
};