const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const appSchema = new Schema({
  created: { type: Date, default: Date.now },
  date: { type: String, required: true },
  timeId: { type: String, required: true },
  time: { type: String, required: true },
  status: {
    type: { type: String, default: "pending" },
    role: { type: String, default: "" },
  },
  clientId: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
  businessId: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "Business",
  },
});

module.exports = mongoose.model("Appointment", appSchema);
