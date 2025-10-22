// 1. Import dependencies
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Import your Product model
const Product = require('./models/productModel');

// 2. Load environment variables
dotenv.config();

// 3. Create Express App
const app = express();
app.use(express.json()); // Middleware to parse JSON bodies

// 4. Define API Routes

// POST /products - Create a new product
app.post('/products', async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).send(product);
  } catch (error) {
    res.status(400).send(error);
  }
});

// GET /products - Get all products
app.get('/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).send(products);
  } catch (error) {
    res.status(500).send(error);
  }
});

// GET /products/category/:categoryName
// This is the route from your screenshot
app.get('/products/category/:categoryName', async (req, res) => {
  try {
    const category = req.params.categoryName;
    const products = await Product.find({ category: category });
    
    if (products.length === 0) {
      return res.status(404).send({ message: 'No products found in this category' });
    }
    res.status(200).send(products);
  } catch (error) {
    res.status(500).send(error);
  }
});

// GET /products/by-color/:color
// This is the other route from your screenshot
app.get('/products/by-color/:color', async (req, res) => {
  try {
    const color = req.params.color;
    // Query nested array
    const products = await Product.find({ 'variants.color': color }); 
    
    if (products.length === 0) {
      return res.status(404).send({ message: 'No products found with this color' });
    }
    res.status(200).send(products);
  } catch (error) {
    res.status(500).send(error);
  }
});


// 5. Connect to MongoDB and Start Server
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Database connection error:', err);
  });