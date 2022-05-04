const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const businessSchema = new Schema({
  userId: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
  name: { type: String, required: true },
  email: { type: String, required: true },
  ownername: { type: String, required: true },
  city: { type: String, required: true },
  area: { type: String, required: true },
  address: { type: String, required: true },
  description: { type: String, required: true },
  phone: { type: String, required: true },
  type: { type: String, required: true },
  images: [{ type: String, required: true }],
  hours: [],
  created: { type: Date, default: Date.now },
});

businessSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Business", businessSchema);
