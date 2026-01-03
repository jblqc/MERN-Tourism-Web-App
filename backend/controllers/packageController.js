// controllers/packageController.js
const Package = require('../models/packageModel');
const Tour = require('../models/tourModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');
const APIFeatures = require('../utils/apiFeatures'); // reuse your APIFeatures if needed

// compute aggregated fields from includedTours
async function computePackageAggregates(body) {
  if (!body.includedTours || body.includedTours.length === 0) return body;

  const tours = await Tour.find({ _id: { $in: body.includedTours } }).select(
    'price duration ratingsAverage ratingsQuantity imageCover country'
  );

  body.totalPrice = tours.reduce((s, t) => s + (t.price || 0), 0);
  body.totalDays = tours.reduce((s, t) => s + (t.duration || 0), 0);
  body.ratingAverage =
    tours.reduce((s, t) => s + (t.ratingsAverage || 4.5), 0) / (tours.length || 1);
  body.ratingQuantity = tours.reduce((s, t) => s + (t.ratingsQuantity || 0), 0);

  // if package has no explicit country, try to infer common country or set "Mixed"
  if (!body.country) {
    const countries = [...new Set(tours.map((t) => t.country).filter(Boolean))];
    body.country = countries.length === 1 ? countries[0] : 'Mixed';
  }

  // set default imageCover if not supplied
  if (!body.imageCover && tours.length > 0) {
    body.imageCover = tours[0].imageCover;
  }

  return body;
}

exports.createPackage = catchAsync(async (req, res, next) => {
  const computedBody = await computePackageAggregates({ ...req.body });
  const pkg = await Package.create(computedBody);
  res.status(201).json({ status: 'success', data: pkg });
});

exports.getAllPackages = catchAsync(async (req, res, next) => {
  // support priceMin, priceMax, country, theme, isFeatured, tags, days range
  const queryObj = { ...req.query };
  const filter = {};

  if (queryObj.country) filter.country = { $regex: queryObj.country, $options: 'i' };
  if (queryObj.theme) filter.theme = queryObj.theme;
  if (queryObj.isFeatured !== undefined) filter.isFeatured = queryObj.isFeatured === 'true';
  if (queryObj.tags) filter.tags = { $in: queryObj.tags.split(',') };
  if (queryObj.priceMin || queryObj.priceMax) {
    filter.totalPrice = {};
    if (queryObj.priceMin) filter.totalPrice.$gte = Number(queryObj.priceMin);
    if (queryObj.priceMax) filter.totalPrice.$lte = Number(queryObj.priceMax);
  }
  if (queryObj.daysMin || queryObj.daysMax) {
    filter.totalDays = {};
    if (queryObj.daysMin) filter.totalDays.$gte = Number(queryObj.daysMin);
    if (queryObj.daysMax) filter.totalDays.$lte = Number(queryObj.daysMax);
  }

  let query = Package.find(filter);

  // sorting
  if (req.query.sort) {
    query = query.sort(req.query.sort.split(',').join(' '));
  } else {
    query = query.sort('-isFeatured -ratingAverage -createdAt');
  }

  // field limiting
  if (req.query.fields) {
    query = query.select(req.query.fields.split(',').join(' '));
  } else {
    query = query.select('-__v');
  }

  // pagination
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 20;
  const skip = (page - 1) * limit;
  query = query.skip(skip).limit(limit);

  const packages = await query;
  res.status(200).json({ status: 'success', results: packages.length, data: packages });
});

exports.getPackage = factory.getOne(Package); // will return populated includedTours via model pre hook
exports.updatePackage = catchAsync(async (req, res, next) => {
  // if includedTours changed, recompute aggregates
  let body = { ...req.body };
  if (body.includedTours) body = await computePackageAggregates(body);

  const pkg = await Package.findByIdAndUpdate(req.params.id, body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ status: 'success', data: pkg });
});

exports.deletePackage = factory.deleteOne(Package);
