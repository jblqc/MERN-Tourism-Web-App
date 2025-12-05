const sharp = require("sharp");
const multer = require("multer");
const Tour = require("../models/tourModel");
const Review = require("../models/reviewModel");
const Booking = require("../models/bookingModel");

const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const factory = require("./handlerFactory");
const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an image! Please upload only images.", 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadTourImages = upload.fields([
  { name: "imageCover", maxCount: 1 },
  { name: "images", maxCount: 3 },
]);
exports.resizeTourImages = catchAsync(async (req, res, next) => {
  if (!req.files) return next();

  if (req.files.imageCover) {
    req.body.imageCover = `tour-${req.params.id}-${Date.now()}-cover.jpeg`;
    await sharp(req.files.imageCover[0].buffer)
      .resize(2000, 1333)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`public/img/tours/${req.body.imageCover}`);
  }

  if (req.files.images) {
    req.body.images = [];
    await Promise.all(
      req.files.images.map(async (file, i) => {
        const filename = `tour-${req.params.id}-${Date.now()}-${i + 1}.jpeg`;
        await sharp(file.buffer)
          .resize(2000, 1333)
          .toFormat("jpeg")
          .jpeg({ quality: 90 })
          .toFile(`public/img/tours/${filename}`);
        req.body.images.push(filename);
      })
    );
  }

  next();
});
exports.getTourBySlug = catchAsync(async (req, res, next) => {
  const tour = await Tour.findOne({ slug: req.params.slug });
  if (!tour) return next(new AppError("No tour found with that slug", 404));

  res.status(200).json({ status: "success", data: { tour: tour.toClient() } });
});

exports.aliasTopTour = (req, res, next) => {
  req.query.limit = "3";
  req.query.sort = "-ratingsAverage,price";
  req.query.fields = "name,ratingsAverage,price,summary,difficulty";
  next();
};
exports.getAllTours = factory.getAll(Tour);
exports.getTour = factory.getOne(Tour, { path: "reviews" });
exports.deleteTour = factory.deleteOne(Tour);
exports.updateTour = factory.updateOne(Tour);
exports.createTour = factory.createOne(Tour);
// Aggregation middleware: This runs before the query is executed
// A pipeline is an array of stages that process documents
// Each stage is an object with a $match, $group, $sort, etc.
// Stages can be combined with the $facet operator
exports.getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: {
        ratingsAverage: { $gte: 4.5 },
      },
    },
    {
      $group: {
        _id: { $toUpper: "$difficulty" },
        numTours: { $sum: 1 },
        numRatings: { $sum: "$ratingsQuantity" },
        avgRating: { $avg: "$ratingsAverage" },
        avgRatingPrice: { $avg: "$price" },
        minPrice: { $min: "$price" },
        maxPrice: { $max: "$price" },
        count: { $sum: 1 },
      },
    },
    {
      $sort: { avgRating: 1 },
    },
    // {
    //     $match: {
    //         _id: {
    //             $ne: 'EASY'
    //         }
    //     },
    // },
  ]);
  res.status(200).json({
    status: "success",
    data: {
      stats,
    },
  });
});
exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.query.year * 1;
  const plan = await Tour.aggregate([
    {
      $unwind: "$startDates",
    },
    {
      $match: {
        startDates: {
          $gte: new Date(year, 0, 1),
          $lte: new Date(year, 11, 31),
        },
      },
    },
    {
      $group: {
        _id: {
          $month: "$startDates",
        },
        numTours: {
          $sum: 1,
        },
        tours: {
          $push: "$name",
          // $push: "$price"
        },
      },
    },
    { $addFields: { month: "$_id" } },
    {
      $project: {
        _id: 0,
      },
    },
    {
      $sort: {
        numTours: -1,
      },
    },
  ]);

  res.status(200).json({
    status: "success",
    data: {
      plan,
    },
  });
});
exports.getToursWithin = catchAsync(async (req, res, next) => {
  const { distance, latlong, unit } = req.params;
  const [lat, long] = latlong.split(",");
  //get radiance
  const radius = unit === "mi" ? distance / 3963.2 : distance / 6378.1;
  if (!lat || !long) {
    next(
      new AppError(
        "Please provide latitude and longitude in the format lat,long",
        400
      )
    );
  }
  const tours = await Tour.find({
    startLocation: { $geoWithin: { $centerSphere: [[long, lat], radius] } },
  });
  res
    .status(200)
    .json({ status: "SUCCESS", results: tours.length, data: tours });
});
exports.getDistances = catchAsync(async (req, res, next) => {
  const { latlong, unit } = req.params;
  const [lat, long] = latlong.split(",");
  //get radiance
  const multiplier = unit === "mi" ? 0.000621371 : 0.001;
  if (!lat || !long) {
    next(
      new AppError(
        "Please provide latitude and longitude in the format lat,long",
        400
      )
    );
  }
  const distances = await Tour.aggregate([
    {
      $geoNear: {
        near: { type: "Point", coordinates: [long * 1, lat * 1] },
        distanceField: "distance",
        distanceMultiplier: multiplier,
      },
    },
    { $project: { distance: 1, name: 1 } },
  ]);

  res.status(200).json({ status: "SUCCESS", data: distances });
});
exports.getAllCountries = catchAsync(async (req, res, next) => {
  const countries = await Tour.distinct("country");

  res.status(200).json({
    status: "success",
    results: countries.length,
    data: {
      countries,
    },
  });
});
exports.getHomepageStats = catchAsync(async (req, res, next) => {
  const [
    totalTours,
    totalReviews,
    totalBookings,
    topCountries,
    topRatedTours,
    guideCount,
  ] = await Promise.all([
    Tour.countDocuments(),

    Review.countDocuments(),

    Booking.countDocuments({ paid: true }),

    Tour.aggregate([
      {
        $group: {
          _id: "$country",
          numTours: { $sum: 1 },
        },
      },
      { $sort: { numTours: -1 } },
      { $limit: 5 },
      { $project: { _id: 0, country: "$_id", numTours: 1 } },
    ]),

    Tour.aggregate([
      { $sort: { ratingsAverage: -1, ratingsQuantity: -1 } },
      { $limit: 3 },
      {
        $project: {
          _id: 1,
          slug: 1,
          name: 1,
          price: 1,
          summary: 1,
          ratingsAverage: 1,
          imageCover: 1,
        },
      },
    ]),

    Tour.aggregate([
      { $unwind: "$guides" },
      {
        $group: {
          _id: "$guides",
        },
      },
      { $count: "guideCount" },
    ]),
  ]);

  res.status(200).json({
    status: "success",
    data: {
      totalTours,
      totalReviews,
      totalBookings,
      topCountries,
      topRatedTours,
      guideCount: guideCount[0]?.guideCount || 0,
    },
  });
});
