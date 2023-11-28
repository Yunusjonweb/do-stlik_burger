const mongoose = require("mongoose");

let UserSchema = new mongoose.Schema({
  user_id: {
    type: String,
    unique: true,
  },
  phone_number: {
    type: Number,
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
