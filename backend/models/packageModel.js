// models/packageModel.js
const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'A package must have a title'],
      trim: true,
      maxlength: 120,
    },
    subtitle: String,
    description: {
      type: String,
      required: [true, 'A package must have a description'],
    },
    country: {
      type: String,
      required: [true, 'A package must have a country'],
    },
    imageCover: {
      type: String,
      required: [true, 'A package must have a cover image'],
    },
    images: [String],
    includedTours: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Tour',
        required: true,
      },
    ],
    totalPrice: Number,
    totalDays: Number,
    ratingAverage: { type: Number, default: 4.5, min: 1, max: 5 },
    ratingQuantity: { type: Number, default: 0 },
    theme: {
      type: String,
      enum: ['adventure', 'romantic', 'family', 'beach', 'culture', 'nature', 'winter', 'custom'],
      default: 'custom',
    },
    tags: [String],
    isFeatured: { type: Boolean, default: false },
    meta: { type: mongoose.Schema.Types.Mixed }, // flexible field for extra metadata
  },
  { timestamps: true }
);

// auto-populate included tours on find
packageSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'includedTours',
    select: 'name price duration imageCover ratingsAverage ratingsQuantity summary slug country',
  });
  next();
});

const Package = mongoose.model('Package', packageSchema);
module.exports = Package;
