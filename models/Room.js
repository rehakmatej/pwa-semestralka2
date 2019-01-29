const mongoose = require('mongoose');
const RoomSchema = new mongoose.Schema({
  roomName: { type: String, required: true, index: { unique: true } },
  owner: { type: String, required: true },
  members: {type: [String], required: true}
});

module.exports = mongoose.model('Room', RoomSchema);