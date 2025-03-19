const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  patientName: { type: String, required: true },
  date: { type: Date, required: true, },
  time: { type: String, required: true}, //match: /^(0?[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$/ }, // HH:MM AM/PM format
  status: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending" }
});

module.exports = mongoose.model("appointments", appointmentSchema);
