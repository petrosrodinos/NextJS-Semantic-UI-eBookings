const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  created: { type: Date, default: Date.now },
  name: { type: String, required: true },
  email: {
    type: String,
    require: true,
    unique: true,
  },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  city: { type: String, required: true },
  area: { type: String, required: true },
  business: {
    hasBusiness: { type: Boolean, required: true, default: false },
    businessId: {
      type: mongoose.Types.ObjectId,
      required: false,
      ref: "Business",
    },
  },
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);
