const mongoose = require('mongoose')

const SiteSchema = new mongoose.Schema({
  campground: {
    type: mongoose.Schema.ObjectId,
    ref: 'Campground',
    required: [true, 'Please add a campground'],
  },
  zone: String,
  number: {
    type: Number,
    required: [true, 'Please add a unique site number'],
  },
  size: {
    type: {
      swidth: {
        type: Number,
        min: 0,
        required: [true, 'Please add a site width'],
      },
      slength: {
        type: Number,
        min: 0,
        required: [true, 'Please add a site length'],
      },
    },
  },
})

// Delete site
SiteSchema.pre(
  'deleteOne',
  { document: true, query: false },
  async function (next) {
    console.log(this.campground, this._id)
    await this.model('Reserve').deleteMany({ site: this._id })
    await this.model('Campground').findByIdAndUpdate(
      this.campground,
      {
        $pull: { sites: this._id },
        $inc: { amount: -1 },
      },
      { runValidators: true }
    )
    next()
  }
)

module.exports = mongoose.model('Site', SiteSchema)
