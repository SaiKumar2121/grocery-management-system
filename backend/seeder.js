const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const Product = require('./models/Product'); // Adjust the path if needed

dotenv.config();

mongoose.connect(process.env.MONGO_URI);

const products = JSON.parse(fs.readFileSync('./data/products.json', 'utf-8'));

// Normalize data for comparison
const normalizeData = (data) => {
  const normalized = { ...data };

  // Convert date fields to ISO strings for comparison
  if (normalized.expDate) normalized.expDate = new Date(normalized.expDate).toISOString();
  if (normalized.mfdDate) normalized.mfdDate = new Date(normalized.mfdDate).toISOString();

  // Convert numbers and arrays to ensure correct comparison
  normalized.price = parseFloat(normalized.price);
  normalized.stock = parseInt(normalized.stock, 10);
  normalized.images = normalized.images || [];
  normalized.suggestion = normalized.suggestion || [];
  normalized.allegations = normalized.allegations || [];

  return normalized;
};

const syncData = async () => {
  try {
    for (const product of products) {
      const normalizedProduct = normalizeData(product);

      // Check if the product already exists
      const existingProduct = await Product.findOne({ title: normalizedProduct.title });

      if (existingProduct) {
        const normalizedExistingProduct = normalizeData(existingProduct.toObject());

        // Compare normalized fields
        const isDifferent = Object.keys(normalizedProduct).some(
          (key) => JSON.stringify(normalizedProduct[key]) !== JSON.stringify(normalizedExistingProduct[key])
        );

        if (isDifferent) {
          // Update only if there are changes
          await Product.updateOne({ title: normalizedProduct.title }, { $set: normalizedProduct });
          console.log(`Updated: ${normalizedProduct.title}`);
        }
      } else {
        // Insert new product if it doesn't exist
        await Product.create(normalizedProduct);
        console.log(`Inserted: ${normalizedProduct.title}`);
      }
    }

    // Remove products not in JSON
    const titlesInJSON = products.map((product) => product.title);
    const removedProducts = await Product.deleteMany({
      title: { $nin: titlesInJSON }
    });

    if (removedProducts.deletedCount > 0) {
      console.log(`Removed ${removedProducts.deletedCount} products not in JSON.`);
    }

    console.log('Data synchronization complete!');
  } catch (err) {
    console.error('Error synchronizing data:', err);
  }
};

module.exports = syncData;
