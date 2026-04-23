// customers.js
const express = require('express');
const router = express.Router();
const Invoice = require('../models/Invoice');
const { protect } = require('../middleware/auth');

router.get('/', protect, async (req, res) => {
  try {
    const customers = await Invoice.aggregate([
      { $match: { status: { $ne: 'Cancelled' } } },
      { $group: {
        _id: '$customer.name',
        phone: { $first: '$customer.phone' },
        gstin: { $first: '$customer.gstin' },
        totalInvoices: { $sum: 1 },
        totalAmount: { $sum: '$finalAmount' },
        lastOrder: { $max: '$createdAt' }
      }},
      { $sort: { totalAmount: -1 } }
    ]);
    res.json({ success: true, customers });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
