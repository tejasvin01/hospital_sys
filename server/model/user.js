const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ["admin", "doctor", "receptionist", "patient"], required: true },
  age: { 
    type: Number,
    min: 1,
    max: 120
  },
  gender: { 
    type: String, 
    enum: ["Male", "Female", "Other"]
  },
  contactNumber: {
    type: String,
    validate: {
      validator: function(v) {
        // Basic phone number validation
        return /^\+?[0-9]{10,15}$/.test(v.replace(/[\s-]/g, ''));
      },
      message: props => `${props.value} is not a valid phone number!`
    }
  },
  bloodGroup: String,
  address: String,
});

module.exports = mongoose.model("User", userSchema);