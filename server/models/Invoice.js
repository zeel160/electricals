const mongoose = require('mongoose');

const invoiceItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  name: { type: String, required: true },
  hsnCode: { type: String },
  quantity: { type: Number, required: true },
  unit: { type: String, default: 'Pcs' },
  pricePerUnit: { type: Number, required: true },
  gstRate: { type: Number, default: 18 },
  gstAmount: { type: Number },
  amount: { type: Number },
});

const invoiceSchema = new mongoose.Schema({
  invoiceNumber: { type: String, unique: true },
  customer: {
    name: { type: String, required: true },
    address: { type: String },
    gstin: { type: String },
    phone: { type: String },
    email: { type: String },
    state: { type: String, default: '24-Gujarat' },
  },
  items: [invoiceItemSchema],
  subTotal: { type: Number },
  sgst: { type: Number },
  cgst: { type: Number },
  igst: { type: Number },
  totalAmount: { type: Number },
  roundOff: { type: Number },
  finalAmount: { type: Number },
  received: { type: Number, default: 0 },
  balance: { type: Number },
  paymentMode: { type: String, enum: ['Cash', 'UPI', 'Bank Transfer', 'Cheque', 'Pending'], default: 'Pending' },
  status: { type: String, enum: ['Draft', 'Issued', 'Paid', 'Partial', 'Cancelled'], default: 'Issued' },
  notes: { type: String },
  placeOfSupply: { type: String, default: '24-Gujarat' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

// Auto-generate invoice number
invoiceSchema.pre('save', async function (next) {
  if (!this.invoiceNumber) {
    const year = new Date().getFullYear();
    const shortYear = String(year).slice(-2);
    const nextYear = String(year + 1).slice(-2);
    const count = await mongoose.model('Invoice').countDocuments();
    this.invoiceNumber = `${year}-${nextYear}/${String(count + 1).padStart(3, '0')}`;
  }
  // Calculate totals
  let sub = 0;
  this.items.forEach(item => {
    const base = item.quantity * item.pricePerUnit;
    const gst = base * (item.gstRate / 100);
    item.gstAmount = parseFloat(gst.toFixed(2));
    item.amount = parseFloat((base + gst).toFixed(2));
    sub += base;
  });
  this.subTotal = parseFloat(sub.toFixed(2));
  const isInterState = false; // same state
  if (isInterState) {
    this.igst = parseFloat((sub * 0.18).toFixed(2));
    this.sgst = 0; this.cgst = 0;
  } else {
    this.sgst = parseFloat((sub * 0.09).toFixed(2));
    this.cgst = parseFloat((sub * 0.09).toFixed(2));
    this.igst = 0;
  }
  this.totalAmount = parseFloat((this.subTotal + this.sgst + this.cgst + this.igst).toFixed(2));
  this.roundOff = parseFloat((Math.round(this.totalAmount) - this.totalAmount).toFixed(2));
  this.finalAmount = Math.round(this.totalAmount);
  this.balance = this.finalAmount - (this.received || 0);
  next();
});

module.exports = mongoose.model('Invoice', invoiceSchema);
