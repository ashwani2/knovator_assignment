const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  title: String,
  body: String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  active: { type: Boolean, default: true },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true,
      default: 'Point',
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
});

postSchema.index({ location: '2dsphere' });

// Static method to get nearby posts
postSchema.statics.getNearbyPosts = async function (latitude, longitude) {
  try {
    const nearbyPosts = await this.find({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(longitude), parseFloat(latitude)],
          },
        },
      },
    });

    return nearbyPosts;
  } catch (error) {
    console.log(error)
    return null
  }
};

module.exports = mongoose.model("Post", postSchema, "posts");
