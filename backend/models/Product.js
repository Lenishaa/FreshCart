const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  category: { type: String, required: true, trim: true },
  unit: { type: String, default: 'unit', trim: true },
  perishable: { type: Boolean, default: true },
  price: { type: Number, required: true, min: 0 },
  image: { type: String, default: '' },
  stock: { type: Number, default: 100, min: 0 },
  expiryDays: { type: Number, default: null }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
