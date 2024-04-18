const mongoose = require('mongoose')

const ReviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Please add a user'],
  },
  campground: {
    type: mongoose.Schema.ObjectId,
    ref: 'Campground',
    required: [true, 'Please add a campground'],
  },
  score: {
    type: Number,
    min: 0,
    max: 5,
    required: [true, 'Please add a review score'],
  },
  comment: {
    type: String,
  },
  createdAt: { type: Date, default: Date.now },
  isReport: {
    type: Boolean,
    default: false,
  },
})

module.exports = mongoose.model('Review', ReviewSchema)
