const express = require('express');
const router = express.Router();
const Inquiry = require('../models/Inquiry');
const { protect } = require('../middleware/auth');

// Public inquiry submission
router.post('/', async (req, res) => {
  try {
    const inquiry = await Inquiry.create(req.body);
    res.status(201).json({ success: true, message: 'Inquiry submitted! We will contact you shortly.', inquiry });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// Protected routes
router.get('/', protect, async (req, res) => {
  const { status, page = 1, limit = 20 } = req.query;
  const query = status ? { status } : {};
  const total = await Inquiry.countDocuments(query);
  const inquiries = await Inquiry.find(query).sort('-createdAt').skip((page-1)*limit).limit(Number(limit));
  res.json({ success: true, total, inquiries });
});

router.put('/:id', protect, async (req, res) => {
  const inquiry = await Inquiry.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json({ success: true, inquiry });
});

module.exports = router;
