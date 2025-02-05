const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  senderId: { type: String, required: true },
  receiverId: { type: String, required: true },
  messageText: { type: String, required: true },
  roomId:{type: String, required: true},
},{
  timestamps: false
});

module.exports = mongoose.model('Message', messageSchema);
