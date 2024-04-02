const mongoose = require('mongoose')

const LogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Please add a user'],
  },
  action: {
    type: String,
    enum: ['login', 'logout'],
  },
  accessedAt: { type: Date, default: Date.now },
})

module.exports = mongoose.model('Log', LogSchema)
