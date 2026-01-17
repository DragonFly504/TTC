const express = require('express');
const router = express.Router();
const Tracking = require('../models/Tracking');

// Create tracking entry (admin only)
router.post('/', async (req, res) => {
  try {
    const tracking = await Tracking.create(req.body);
    res.status(201).json(tracking);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update tracking status (admin only)
router.put('/:id', async (req, res) => {
  try {
    const updated = await Tracking.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get tracking info (public)
router.get('/find', async (req, res) => {
  try {
    const { q } = req.query;
    const tracking = await Tracking.findOne({ trackingNumber: q });
    if (!tracking) return res.status(404).json({ message: 'Not found' });
    res.json(tracking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
