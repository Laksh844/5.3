const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define the nested variant schema
const variantSchema = new Schema({
  color: { type: String, required: true },
  size: { type: String, required: true },
  stock: { type: Number, required: true, min: 0 }
});

// Define the main product schema
const productSchema = new Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true, index: true },
  variants: [variantSchema] // Embed the variant schema as an array
});

// Create and export the model
const Product = mongoose.model('Product', productSchema);
module.exports = Product;