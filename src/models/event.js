const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  uuid: { type: String, required: true, unique: true },
  name: String,
  start_time: Date,
  end_time: Date,
  invitees: [{ name: String, email: String }],
});

module.exports = mongoose.model("Event", eventSchema);
