const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const appSchema = new Schema({
  created: { type: Date, default: Date.now },
  comment: { type: String, required: true },
  reply: {
    type: String,
    required: false,
    default: "",
  },
  rating: { type: Number, required: true },
  clientId: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
  businessId: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "Business",
  },
});

module.exports = mongoose.model("Comment", appSchema);
