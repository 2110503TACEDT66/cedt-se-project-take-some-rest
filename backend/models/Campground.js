const mongoose = require('mongoose')

const CampgroundSchema = new mongoose.Schema({
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
  pictures: [String],
  facilities: [String],
  tentForRent: {
    type: Boolean,
    require: [true, 'Please add if you have tents for rent'],
  },
  amount: {
    type: Number,
    min: 0,
    require: [true, 'Please add total amount'],
  },
  sites: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Site',
    },
  ],
})

// Delete CAmpground
CampgroundSchema.pre(
  'deleteOne',
  { document: true, query: false },
  async function (next) {
    console.log(this._id)
    await this.model('Reserve').deleteMany({ campground: this._id })
    await this.model('Site').deleteMany({ campground: this._id })
    next()
  }
)

module.exports = mongoose.model('Campground', CampgroundSchema)
