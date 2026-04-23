const express = require('express');
const router = express.Router();
const Invoice = require('../models/Invoice');
const Product = require('../models/Product');
const Inquiry = require('../models/Inquiry');
const { protect } = require('../middleware/auth');

router.get('/', protect, async (req, res) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [totalSales, monthSales, totalInvoices, totalProducts, newInquiries, pendingBalance] = await Promise.all([
      Invoice.aggregate([{ $match: { status: { $ne: 'Cancelled' } } }, { $group: { _id: null, total: { $sum: '$finalAmount' } } }]),
      Invoice.aggregate([{ $match: { createdAt: { $gte: startOfMonth }, status: { $ne: 'Cancelled' } } }, { $group: { _id: null, total: { $sum: '$finalAmount' } } }]),
      Invoice.countDocuments({ status: { $ne: 'Cancelled' } }),
      Product.countDocuments({ isActive: true }),
      Inquiry.countDocuments({ status: 'New' }),
      Invoice.aggregate([{ $match: { balance: { $gt: 0 }, status: { $ne: 'Cancelled' } } }, { $group: { _id: null, total: { $sum: '$balance' } } }]),
    ]);

    // Monthly sales for chart (last 6 months)
    const monthlySales = await Invoice.aggregate([
      { $match: { createdAt: { $gte: new Date(now.getFullYear(), now.getMonth() - 5, 1) }, status: { $ne: 'Cancelled' } } },
      { $group: { _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } }, total: { $sum: '$finalAmount' }, count: { $sum: 1 } } },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    res.json({
      success: true,
      stats: {
        totalSales: totalSales[0]?.total || 0,
        monthSales: monthSales[0]?.total || 0,
        totalInvoices,
        totalProducts,
        newInquiries,
        pendingBalance: pendingBalance[0]?.total || 0,
        monthlySales
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
