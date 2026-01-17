const mongoose = require('mongoose');

const trackingSchema = new mongoose.Schema({
  trackingNumber: { type: String, required: true, unique: true },
  status: { type: String, default: 'Pending' },
  location: String,
  history: [
    {
      date: Date,
      location: String,
      status: String,
      note: String,
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('Tracking', trackingSchema);
