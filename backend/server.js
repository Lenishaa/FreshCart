const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const User = require('./models/User');
const Product = require('./models/Product');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/e_com';
const PORT = process.env.PORT || 5000;

const sampleProducts = [
  { title: 'Bananas', description: 'Fresh ripe bananas - perfect for smoothies and snacks.', category: 'Fruit', unit: 'kg', perishable: true, price: 1.2, stock: 200, image: 'https://images.unsplash.com/photo-1574226516831-e1dff420e8f8?w=800&q=60', expiryDays: 7 },
  { title: 'Milk (1L)', description: 'Whole milk, locally sourced, 1 liter carton.', category: 'Dairy', unit: 'unit', perishable: true, price: 0.99, stock: 100, image: 'https://images.unsplash.com/photo-1582719478179-8f8f7a4a1b8b?w=800&q=60', expiryDays: 10 },
  { title: 'Bread - Whole Wheat', description: 'Freshly baked whole wheat bread loaf.', category: 'Bakery', unit: 'unit', perishable: true, price: 2.5, stock: 80, image: 'https://images.unsplash.com/photo-1542831371-d531d36971e6?w=800&q=60', expiryDays: 3 },
  { title: 'Eggs (12)', description: 'Free-range eggs, dozen pack.', category: 'Dairy', unit: 'unit', perishable: true, price: 3.5, stock: 120, image: 'https://images.unsplash.com/photo-1512470876306-7f5a9f84f8f2?w=800&q=60', expiryDays: 21 },
  { title: 'Apples', description: 'Crisp red apples, ideal for pies and snacks.', category: 'Fruit', unit: 'kg', perishable: true, price: 2.0, stock: 150, image: 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=800&q=60', expiryDays: 14 },
  { title: 'Rice (5kg)', description: 'Long grain white rice, 5kg bag.', category: 'Pantry', unit: 'bag', perishable: false, price: 12.0, stock: 60, image: 'https://images.unsplash.com/photo-1586201375761-83865001e8a3?w=800&q=60', expiryDays: null },
  { title: 'Olive Oil 1L', description: 'Extra virgin olive oil, cold pressed.', category: 'Pantry', unit: 'bottle', perishable: false, price: 8.99, stock: 40, image: 'https://images.unsplash.com/photo-1523986371872-9d3ba2e2f642?w=800&q=60', expiryDays: 365 },
  { title: 'Orange Juice 1L', description: 'Fresh squeezed orange juice, no added sugar.', category: 'Beverages', unit: 'unit', perishable: true, price: 2.99, stock: 70, image: 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=800&q=60', expiryDays: 14 },
  { title: 'Cheddar Cheese', description: 'Aged cheddar block, 250g.', category: 'Dairy', unit: 'unit', perishable: true, price: 4.5, stock: 50, image: 'https://images.unsplash.com/photo-1585238342028-4e7f5d4b3f2b?w=800&q=60', expiryDays: 60 },
  { title: 'Tomatoes', description: 'Vine-ripened tomatoes, juicy and flavorful.', category: 'Vegetables', unit: 'kg', perishable: true, price: 1.8, stock: 120, image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=60', expiryDays: 7 },
  { title: 'Pasta (500g)', description: 'Durum wheat pasta, 500g.', category: 'Pantry', unit: 'pack', perishable: false, price: 1.4, stock: 90, image: 'https://images.unsplash.com/photo-1523986371872-9d3ba2e2f642?w=800&q=60', expiryDays: 730 },
  { title: 'Chicken Breast (1kg)', description: 'Boneless skinless chicken breasts.', category: 'Meat', unit: 'kg', perishable: true, price: 6.5, stock: 40, image: 'https://images.unsplash.com/photo-1604908177522-1a7c7d2b4f8b?w=800&q=60', expiryDays: 5 }
];

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
    initializeData();
  })
  .catch(err => {
    console.error('MongoDB connection error:', err.message);
    console.warn('Attempting to continue without DB connection...');
    initializeData().catch(() => {});
  });

async function initializeData() {
  try {
    await createDefaultAdmin();
    await populateSampleProducts();
  } catch (error) {
    console.error('Error initializing data:', error.message);
  }
}

async function createDefaultAdmin() {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    const existing = await User.findOne({ email: adminEmail });
    if (!existing) {
      const admin = new User({
        name: 'Administrator',
        email: adminEmail,
        password: adminPassword,
        role: 'admin'
      });
      await admin.save();
      console.log('✓ Default admin user created:', adminEmail);
    }
  } catch (error) {
    console.error('Could not create default admin:', error.message);
  }
}

async function populateSampleProducts() {
  try {
    const count = await Product.countDocuments();
    if (count === 0) {
      await Product.insertMany(sampleProducts);
      console.log('✓ Loaded', sampleProducts.length, 'sample grocery products');
    }
  } catch (error) {
    console.error('Could not populate sample products:', error.message);
  }
}

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

app.get('/', (req, res) => {
  res.send({ message: 'E-Commerce API is running' });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
