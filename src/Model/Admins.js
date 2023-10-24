const mongoose = require("mongoose");

const AdminSchema = new mongoose.Schema({
  user_id: {
    type: String,
    required: true,
  },
  step: {
    type: String,
    default: 0,
  },
});

const admins = mongoose.model("admins", AdminSchema);
module.exports = admins;
