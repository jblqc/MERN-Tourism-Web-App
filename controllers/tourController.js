const Tour = require('../models/tourModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

exports.aliasTopTour = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,ratingsAverage,price,summary,difficulty';
  next();
};
exports.getAllTours = factory.getAll(Tour);
exports.getTour = factory.getOne(Tour, { path: 'reviews' });
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
        _id: { $toUpper: '$difficulty' },
        numTours: { $sum: 1 },
        numRatings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgRatingPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
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
    status: 'success',
    data: {
      stats,
    },
  });
});
exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.query.year * 1;
  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates',
    },
    {
      $match: {
        startDates: {
          $gte: new Date(year, 1, 1),
          $lte: new Date(year, 12, 31),
        },
      },
    },
    {
      $group: {
        _id: {
          $month: '$startDates',
        },
        numTours: {
          $sum: 1,
        },
        tours: {
          $push: '$name',
          // $push: "$price"
        },
      },
    },
    { $addFields: { month: '$_id' } },
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
    status: 'success',
    data: {
      plan,
    },
  });
});
exports.getToursWithin = catchAsync(async (req, res, next) => {
  const { distance, latlong, unit } = req.params;
  const [lat, long] = latlong.split(',');
  //get radiance
  const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;
  if (!lat || !long) {
    next(
      new AppError(
        'Please provide latitude and longitude in the format lat,long',
        400,
      ),
    );
  }
  const tours = await Tour.find({
    startLocation: { $geoWithin: { $centerSphere: [[long, lat], radius] } },
  });
  res
    .status(200)
    .json({ status: 'SUCCESS', results: tours.length, data: tours });
});
exports.getDistances = catchAsync(async (req, res, next) => {
  const { latlong, unit } = req.params;
  const [lat, long] = latlong.split(',');
  //get radiance
  const multiplier = unit === 'mi' ? 0.000621371 : 0.001;
  if (!lat || !long) {
    next(
      new AppError(
        'Please provide latitude and longitude in the format lat,long',
        400,
      ),
    );
  }
  const distances = await Tour.aggregate([
    {
      $geoNear: {
        near: { type: 'Point', coordinates: [long * 1, lat * 1] },
        distanceField: 'distance',
        distanceMultiplier: multiplier,
      },
    },
    { $project: { distance: 1, name: 1 } },
  ]);

  res.status(200).json({ status: 'SUCCESS', data: distances });
});
