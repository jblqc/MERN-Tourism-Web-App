const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const APIFeatures = require("../utils/apiFeatures");
const formatDoc = (doc) => {
  if (!doc) return doc;
  if (typeof doc.toClient === "function") return doc.toClient();
  return doc;
};

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);
    res.status(201).json({
      status: "success",
      data: {
        doc: formatDoc(doc),
      },
    });
  });
exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) {
      return next(
        new AppError(`Cant find document with id ${req.params.id}`, 404)
      );
    }
    res.status(200).json({
      status: "success",
      message: "doc deleted successfully",
    });
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!doc) {
      return next(
        new AppError(`Cant find document with id ${req.params.id}`, 404)
      );
    }
    res.status(200).json({
      status: "success",
      data: {
        doc: formatDoc(doc),
      },
    });
  });
exports.getOne = (Model, populateOpt) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (populateOpt) query = query.populate(populateOpt);
    const doc = await query;

    if (!doc) {
      return next(
        new AppError(`Cant find document with id ${req.params.id}`, 404)
      );
    }
    //doc.findOne({_id: req.params.id})
    res.status(200).json({
      status: "success",
      data: {
        doc: formatDoc(doc),
      },
    });
  });

exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    //to allow nested get reviews for tour
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };
    // 5. Execute query
    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const doc = await features.query;
    // 6. Send response
    res.status(200).json({
      status: "success",
      results: doc.length,
      data: {
        doc: formatDoc(doc),
      },
    });
  });
