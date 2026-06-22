const express = require('express');
const Order = require('../models/Order');
const Product = require('../models/Product');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

const router = express.Router();

router.post('/', authMiddleware, async (req, res) => {
  try {
    const { items } = req.body;
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Order items are required' });
    }

    const productIds = items.map(item => item.product);
    const products = await Product.find({ _id: { $in: productIds } });
    const productMap = new Map(products.map(product => [product._id.toString(), product]));

    let total = 0;
    const orderItems = items.map(item => {
      const product = productMap.get(item.product);
      if (!product) {
        throw new Error('Product not found');
      }
      const price = product.price;
      total += price * item.quantity;
      return {
        product: product._id,
        quantity: item.quantity,
        price
      };
    });

    const order = new Order({
      user: req.user._id,
      items: orderItems,
      total
    });

    await order.save();
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Could not create order', error: error.message });
  }
});

router.get('/', authMiddleware, async (req, res) => {
  try {
    const filter = req.user.role === 'admin' ? {} : { user: req.user._id };
    const orders = await Order.find(filter).populate('user', 'name email role').populate('items.product', 'title price');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Could not fetch orders', error: error.message });
  }
});

router.put('/:id/status', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    const { status } = req.body;
    if (!['pending', 'confirmed', 'shipped', 'delivered'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }
    order.status = status;
    await order.save();
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Could not update order status', error: error.message });
  }
});

module.exports = router;
