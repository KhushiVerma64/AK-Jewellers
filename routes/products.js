const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const multer = require('multer');
const { isAuthenticated, isOwner } = require('../middleware/auth');

// Set storage engine
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

// Init upload
const upload = multer({ storage: storage });

// Show add product form
router.get('/add',isAuthenticated,  (req, res) => {
  res.render('add-product');
});


// POST route to add product
router.post('/add', isAuthenticated, upload.single('image'), async (req, res) => {
  try {
    console.log('Uploaded file:', req.file);

    const newProduct = new Product({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      category: req.body.category,  
      image: req.file ? '/uploads/' + req.file.filename : '',
      createdBy: req.user._id
    });

    await newProduct.save();
    console.log('Product saved:', newProduct); 
    res.redirect('/gallery');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error uploading product');
  }
});

// Edit page
router.get('/:id/edit',isAuthenticated, isOwner, async (req, res) => {
  const product = await Product.findById(req.params.id);
  res.render('editProduct', { product });
});


// Handle delete
router.delete('/:id', isAuthenticated, isOwner, async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.redirect('/gallery');
});



// for searchbar
router.get('/search', async (req, res) => {
  const query = req.query.q;
  try {
    const products = await Product.find({
      name: { $regex: query, $options: 'i' } // case-insensitive
    });

    res.render('gallery', { products });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error searching products');
  }
});


// View product details by ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).send("Product not found");
    res.render('productDetails', { product });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

//post rout for product
router.put('/:id', isAuthenticated, upload.single('image'), async (req, res) => {
  try {
    const { name, price, description, category } = req.body;
    const updateData = { name, price, description, category };

    // Add image if uploaded
    if (req.file) {
      updateData.image = '/uploads/' + req.file.filename;
    }
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true });

    console.log('Updated product:', updatedProduct); 
    res.redirect(`/products/${req.params.id}`);
  } catch (err) {
    console.error('Update error:', err);
    res.status(500).send('Failed to update product.');
  }
});

//category route
router.get('/category/:categoryName', async (req, res) => {
  const categoryName = req.params.categoryName;

  try {
    const products = await Product.find({ category: categoryName }); 
    res.render('category', { categoryName, products });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});


// // for searchbar
// router.get('/search', async (req, res) => {
//   const query = req.query.q;
//   try {
//     const products = await Product.find({
//       name: { $regex: query, $options: 'i' } // case-insensitive
//     });

//     res.render('gallery', { products });
//   } catch (err) {
//     console.error(err);
//     res.status(500).send('Error searching products');
//   }
// });


module.exports = router;