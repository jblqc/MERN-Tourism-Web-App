const catchAsync = require('../utils/catchAsync');
const Review = require('../models/reviewModel')
const factory = require('./handlerFactory')

//USES TOURID FROM TOURROUTE
exports.getAllReviews = factory.getAll(Review)
exports.getReview = factory.getOne(Review);
exports.setTourUserIds = (req, res, next) => {
    //if di nahanap sa erq body yung id, then kunin sa params
    if (!req.body.tour) req.body.tour = req.params.tourId;
    //from the protect middleware kung saan nag reerqurie ang login
    if (!req.body.user) req.body.user = req.user.id;
    next();
};
//USES TOURID FROM TOURROUTE
exports.createReview = factory.createOne(Review);
exports.updateReview = factory.updateOne(Review);
exports.deleteReview = factory.deleteOne(Review);