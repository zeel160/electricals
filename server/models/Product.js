const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  category: {
    type: String, required: true,
    enum: ['MCB & Circuit Breakers', 'Cables & Wires', 'Switches & Sockets', 'LED Lighting', 'Control Panels', 'Fans', 'Conduits & Accessories', 'Meters & Instruments', 'Other']
  },
  brand: { type: String, trim: true },
  model: { type: String },
  description: { type: String },
  hsnCode: { type: String },
  price: { type: Number, required: true, min: 0 },
  gstRate: { type: Number, default: 18 },
  unit: { type: String, default: 'Pcs', enum: ['Pcs', 'Mtr', 'Roll', 'Set', 'Box', 'Kg'] },
  stock: { type: Number, default: 0 },
  minStock: { type: Number, default: 5 },
  image: { type: String },
  isActive: { type: Boolean, default: true },
  tags: [{ type: String }],
}, { timestamps: true });

productSchema.index({ name: 'text', brand: 'text', category: 'text', tags: 'text' });

module.exports = mongoose.model('Product', productSchema);
