const mongoose = require('mongoose')

const CampgroundSchema = new mongoose.Schema({

  campgroundOwner: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
  name: {
    type: String,
    require: [true, 'Please add a name'],
  },
  tel: {
    type: String,
    minLength: 11,
    maxLength: 12,
    pattern: '^([0-9]{3}|[0-9]{2})-[0-9]{3}-[0-9]{4}$',
    require: [true, 'Please add a telephone number'],
  },
  address: {
    houseNumber: {
      type: String,
      require: [true, 'Please add a house number'],
    },
    lane: String,
    road: String,
    subDistrict: {
      type: String,
      require: [true, 'Please add a sub district'],
    },
    district: {
      type: String,
      require: [true, 'Please add a district'],
    },
    province: {
      type: String,
      require: [true, 'Please add a province'],
    },
    postalCode: {
      type: String,
      pattern: '^[0-9]{5}$',
      require: [true, 'Please add a postal code'],
    },
    link: String,
  },
  website: String,
  facilities: [String],
  amount: {
    type: Number,
    min: 0,
    require: [true, 'Please add total amount'],
  },
  averageScore: {
    type: Number,
    min: 0,
    max: 5,
    default: null,
  },
  sites: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Site',
    },
  ],
  // pictures: [String],
  pictureString: {
    base64: String,
    imageFormat: String,
  },
})

// Delete CAmpground
CampgroundSchema.pre(
  'deleteOne',
  { document: true, query: false },
  async function (next) {
    console.log(this._id)
    await this.model('Reserve').deleteMany({ campground: this._id })
    await this.model('Site').deleteMany({ campground: this._id })
    await this.model('Review').deleteMany({ campground: this._id })
    await this.model('User').updateMany(
      { bookmarkCampgrounds: this._id },
      { $pull: { bookmarkCampgrounds: this._id } }
    ) 
    next()
  }
)

module.exports = mongoose.model('Campground', CampgroundSchema)
