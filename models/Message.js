const mongoose = require('mongoose');
const MessageSchema = new mongoose.Schema({
  author: { type: String, required: true},
  room: { type: String, required: true },
  time: {type: String, required: true}
});

module.exports = mongoose.model('Message', MessageSchema);