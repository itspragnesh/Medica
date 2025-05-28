const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  company: { type: String, required: true },
  companyImage: { type: String }, // Add this field
  brandName: { type: String, required: true },
  formula: { type: String, required: true },
  image: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String },
  dosage: { type: String },
});

module.exports = mongoose.model('Medicine', medicineSchema);