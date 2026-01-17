const crypto = require('crypto');
const Tracking = require('../models/Tracking');

exports.createTracking = async (req, res) => {
  try {
    const { userEmail } = req.body;

    const trackingNumber = crypto.randomUUID();

    const tracking = await Tracking.create({
      userEmail,
      trackingNumber,
      status: 'Pending'
    });

    res.status(201).json(tracking);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating tracking' });
  }
};

exports.getTracking = async (req, res) => {
  try {
    const { trackingNumber } = req.params;
    const tracking = await Tracking.findOne({ trackingNumber });

    if (!tracking) {
      return res.status(404).json({ message: 'Tracking not found' });
    }

    res.json(tracking);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching tracking' });
  }
};

