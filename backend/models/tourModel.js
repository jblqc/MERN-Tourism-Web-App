const mongoose = require("mongoose");
const slug = require("slugify");

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A tour must have a name"],
      unique: true,
      trim: true,
      maxlength: [40, "A tour name must be less than 40 characters"],
      minlength: [3, "A tour name must be more than 3 characters"],
    },
    slug: { type: String, unique: true },
    duration: {
      type: Number,
      required: [true, "A tour must have a duration"],
    },
    maxGroupSize: {
      type: Number,
      required: [true, "A tour must have a group size"],
    },
    difficulty: {
      type: String,
      required: [true, "A tour must have a difficulty"],
      enum: {
        values: ["easy", "medium", "difficult"],
        message: "Difficulty must be one of the following: easy, medium, hard",
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      max: [5, "Ratings must be less than 5.0"],
      min: [1, "Ratings must be more than 1.0"],
      set: (val) => Math.round(val * 10) / 10,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, "A tour must have a price"],
    },
    priceDiscount: {
      type: Number,
      validate: {
        // Only works on creating new doc:<
        message: "Discount must be less than the price",
        validator: function (priceDiscount) {
          return priceDiscount < this.price;
        },
      },
    },

    summary: {
      type: String,
      trim: true,
      required: [true, "A tour must have a description"],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, "A tour must have a cover image"],
      default: "default.jpg",
    },
    images: [String],
    startDates: [Date],
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    secretTour: {
      type: Boolean,
      default: false,
    },
    startLocation: {
      //GeoJSON
      type: {
        type: String,
        default: "Point",
        enum: ["Point"],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    locations: [
      {
        type: {
          type: String,
          default: "Point",
          enum: ["Point"],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
    ],
  },

  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
tourSchema.index({ price: 1, ratingsAverage: -1 });
tourSchema.index({ startLocation: "2dsphere" });

tourSchema.virtual("durationWeeks").get(function () {
  return this.duration / 7;
});
//virtual populate
tourSchema.virtual("reviews", {
  ref: "Review",
  foreignField: "tour",
  localField: "_id",
});
//#DOCUMENT MIDDLEWARE IS THE [.save() AND.create()] ONLY
//#this means currently saved document
//#runs before the document is saved
tourSchema.pre("save", function (next) {
  this.slug = slug(this.name, { lower: true });
  next();
});
// tourSchema.pre('save', async function (next) {
//     const promises = this.guides.map(async id => await User.findById(id));
//     this.guides = await Promise.all(promises);
//     next();
// })

// // runs after the document is saved
// tourSchema.post('save', function (doc) {
//     next();

// });

//QUERY MIDDLEWARE IS THE [.find() AND.findOne()] ONLY
//#this means currently executed query

// runs before the query is executed

tourSchema.pre(/^find/, function (next) {
  this.populate({
    path: "guides",
    select: "-__v",
  });
  next();
});
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  this.start = Date.now();
  next();
});

tourSchema.post(/^find/, function (docs, next) {
  console.log("Current query took", Date.now() - this.start, "ms");
  next();
});

//AGGREGATE MIDDLEWARE IS THE [.aggregate()] ONLY
//#this means currently executed aggregation

// runs before the query is executed
// tourSchema.pre('aggregate', function (next) {
//   this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
//   next();
// });
// Add full image URLs automatically
tourSchema.methods.toClient = function () {
  const obj = this.toObject({ virtuals: true });

  const prependIfLocal = (img) => {
    if (!img) return null;

    // If already full URL (http/https), return as is
    if (img.startsWith("http://") || img.startsWith("https://")) return img;

    // Otherwise treat as local image
    return `/img/tours/${img}`;
  };

  // Normalize cover
  obj.imageCover = prependIfLocal(obj.imageCover);

  // Normalize all gallery images
  obj.images = (obj.images || []).map(prependIfLocal);

  return obj;
};

//Model, a wrapperto use the schema
const Tour = mongoose.model("Tour", tourSchema);
module.exports = Tour;
