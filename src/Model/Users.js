const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  user_id: {
    type: String,
    required: true,
    unique: true,
  },
  phone_number: {
    type: String,
  },
  city: {
    type: String,
  },
  code: {
    type: Number,
  },
  lang: {
    type: String,
  },
  step: {
    type: String,
    default: 0,
    required: true,
  },
  longitude: {
    type: String,
  },
  latitude: {
    type: String,
  },
});

const users = mongoose.model("users", UserSchema);
module.exports = users;
