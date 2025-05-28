const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  medicine: { type: mongoose.Schema.Types.ObjectId, ref: 'Medicine', required: true },
  quantity: { type: Number, required: true, min: 1 },
  effectivePrice: { type: Number, required: true, min: 0 },
});

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: {
    type: [orderItemSchema],
    required: true,
    validate: {
      validator: (items) => items.length > 0,
      message: 'Order must contain at least one item',
    },
  },
  totalPrice: { type: Number, required: true, min: 0 },
  userLocation: { type: String, required: true },
  selectedPayment: { type: String, required: true },
  status: { type: String, enum: ['Processing', 'Shipped', 'Delivered', 'Cancelled'], default: 'Processing' },
  cancellationReason: { type: String },
  orderDate: { type: Date, default: Date.now },
}, { timestamps: true });

orderSchema.index({ user: 1 });

module.exports = mongoose.model('Order', orderSchema);