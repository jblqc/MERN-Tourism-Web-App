const express = require('express');
const bookingController = require('./../controllers/bookingController');
const authController = require('./../controllers/authenticationController');

const router = express.Router();

router.use(authController.protect);

router.get(
  '/my-bookings',
  authController.protect,
  bookingController.getMyBookings
);


// Stripe checkout
router.get(
  '/checkout-session/:tourId',
  bookingController.getCheckoutSession
);

// 🔒 ADMIN ONLY BELOW
router
  .route('/')
  .get(authController.restrictTo('admin', 'lead-guide'),bookingController.getAllBookings,)
  .post(authController.restrictTo('admin', 'lead-guide'),bookingController.createBooking);

router
  .route('/:id')
  .get(authController.restrictTo('admin', 'lead-guide'),bookingController.getBooking)
  .patch(authController.restrictTo('admin', 'lead-guide'),bookingController.updateBooking)
  .delete(authController.restrictTo('admin', 'lead-guide'),bookingController.deleteBooking);

module.exports = router;
