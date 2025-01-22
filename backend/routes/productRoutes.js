const express = require('express');
const Product = require('../models/Product');

const router = express.Router();

// Get all products with pagination and optional filtering
router.get('/', async (req, res) => {
  const { category, brand, minPrice, maxPrice, page = 1, limit = 10 } = req.query;

  const filters = {};
  if (category) filters.category = category;
  if (brand) filters.brand = brand;
  if (minPrice || maxPrice) filters.price = { $gte: minPrice || 0, $lte: maxPrice || Infinity };

  const skip = (page - 1) * limit;

  try {
    const products = await Product.find(filters).skip(skip).limit(Number(limit));
    const total = await Product.countDocuments(filters);
    res.status(200).json({ total, page: Number(page), limit: Number(limit), products });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching products', error: err.message });
  }
});

// Get a single product by ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching product', error: err.message });
  }
});

// Add a new product
router.post('/', async (req, res) => {
  const { title, description, category, brand, expDate, mfdDate, size, price, stock, images, suggestion, allegations } = req.body;

  try {
    const product = new Product({
      title,
      description,
      category,
      brand,
      expDate,
      mfdDate,
      size,
      price,
      stock,
      images,
      suggestion,
      allegations
    });

    await product.save();
    res.status(201).json({ message: 'Product added successfully', product });
  } catch (err) {
    res.status(500).json({ message: 'Error adding product', error: err.message });
  }
});

// Update a product by ID
router.put('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json({ message: 'Product updated successfully', product });
  } catch (err) {
    res.status(500).json({ message: 'Error updating product', error: err.message });
  }
});

// Delete a product by ID
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting product', error: err.message });
  }
});

module.exports = router;
