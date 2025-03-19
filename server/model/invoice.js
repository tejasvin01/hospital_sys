const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: ["pending", "paid"], default: "pending" },
  issuedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User"}, 
  createdAt: { type: Date, default: Date.now },
  description: { type: String},
  dueDate: { type: Date }
});


module.exports = mongoose.model("Invoice", invoiceSchema);
