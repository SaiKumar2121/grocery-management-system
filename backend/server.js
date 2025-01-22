const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const productRoutes = require('./routes/productRoutes');
const syncData = require('./seeder'); // Import seeder function

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Sync products data (runs seeder.js logic)
syncData();

// Initialize Express app
const app = express();
app.use(express.json());

app.use('/api/products', productRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
});
