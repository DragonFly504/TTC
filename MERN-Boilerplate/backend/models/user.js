const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: String,
  address: String,
  city: String,
  state: String,
  zip: String,
  country: String,
  ssn: String,
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
