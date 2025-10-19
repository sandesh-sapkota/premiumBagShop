const mongoose = require('mongoose');
const productModel = require('./models/productmodel');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/premiumbagshop")
  .then(() => {
    console.log('Connected to MongoDB');
    createTestProducts();
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });

async function createTestProducts() {
  try {
    // Create some sample products with the new fields
    const sampleProducts = [
      {
        name: "Premium Leather Handbag",
        price: 2999,
        discount: 10,
        category: "handbags",
        quantity: 15,
        description: "Elegant leather handbag perfect for office and casual occasions. Made from genuine leather with premium finishing.",
        image: Buffer.from(''), // Empty buffer for now
        bgcolor: "#8B4513",
        panelcolor: "#D2691E",
        textcolor: "#FFFFFF"
      },
      {
        name: "Travel Backpack Pro",
        price: 1599,
        discount: 0,
        category: "backpacks",
        quantity: 8,
        description: "Durable travel backpack with multiple compartments and water-resistant material. Perfect for adventures.",
        image: Buffer.from(''), // Empty buffer for now
        bgcolor: "#2E8B57",
        panelcolor: "#90EE90",
        textcolor: "#000000"
      },
      {
        name: "Designer Wallet",
        price: 799,
        discount: 15,
        category: "wallets",
        quantity: 25,
        description: "Stylish wallet with RFID blocking technology. Compact design with multiple card slots.",
        image: Buffer.from(''), // Empty buffer for now
        bgcolor: "#4B0082",
        panelcolor: "#DDA0DD",
        textcolor: "#FFFFFF"
      }
    ];

    // Clear existing products first
    await productModel.deleteMany({});
    console.log('Cleared existing products');

    // Insert new products
    const createdProducts = await productModel.insertMany(sampleProducts);
    console.log(`Created ${createdProducts.length} test products:`);
    createdProducts.forEach(product => {
      console.log(`- ${product.name} (₹${product.price}, ${product.quantity} in stock)`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error creating test products:', error);
    process.exit(1);
  }
}