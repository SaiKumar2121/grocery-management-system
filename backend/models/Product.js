const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: { type: String, required: true }, // Renamed from 'name' to 'title' to match JSON
  description: { type: String, required: true },
  category: { type: String, required: true },
  brand: { type: String, required: true },
  expDate: { type: Date, required: true },
  mfdDate: { type: Date, required: true },
  size: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  images: { type: [String], required: true },
  suggestion: { type: [String], default: [] },
  allegations: { type: [String], default: [] }
});

module.exports = mongoose.model('Product', productSchema, 'products');
