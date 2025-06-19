const mongoose = require("mongoose");

const ContactMessageSchema = new mongoose.Schema(
  {
    fullname: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
    phoneNumber: { type: String, required: false }, // Opcional
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("ContactMessage", ContactMessageSchema);
