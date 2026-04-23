const express = require('express');
const router = express.Router();
const Invoice = require('../models/Invoice');
const { protect } = require('../middleware/auth');

// All invoice routes require auth
router.use(protect);

// @GET /api/invoices
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 20, status, search, from, to } = req.query;
    const query = {};
    if (status) query.status = status;
    if (search) query['customer.name'] = new RegExp(search, 'i');
    if (from || to) {
      query.createdAt = {};
      if (from) query.createdAt.$gte = new Date(from);
      if (to) query.createdAt.$lte = new Date(to);
    }
    const total = await Invoice.countDocuments(query);
    const invoices = await Invoice.find(query).sort('-createdAt').skip((page - 1) * limit).limit(Number(limit)).populate('createdBy', 'name');
    res.json({ success: true, total, invoices });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @GET /api/invoices/:id
router.get('/:id', async (req, res) => {
  const invoice = await Invoice.findById(req.params.id).populate('createdBy', 'name').populate('items.product', 'name');
  if (!invoice) return res.status(404).json({ success: false, message: 'Invoice not found' });
  res.json({ success: true, invoice });
});

// @POST /api/invoices
router.post('/', async (req, res) => {
  try {
    const invoice = await Invoice.create({ ...req.body, createdBy: req.user._id });
    res.status(201).json({ success: true, invoice });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// @PUT /api/invoices/:id
router.put('/:id', async (req, res) => {
  try {
    const invoice = await Invoice.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, invoice });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// @DELETE /api/invoices/:id
router.delete('/:id', async (req, res) => {
  await Invoice.findByIdAndUpdate(req.params.id, { status: 'Cancelled' });
  res.json({ success: true, message: 'Invoice cancelled' });
});

module.exports = router;
