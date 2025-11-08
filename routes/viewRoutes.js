const express = require('express');
const viewController = require('../controllers/viewController');
const authController = require('../controllers/authenticationController');
const bookingController = require('../controllers/bookingController');
const router = express.Router();
//TEMPORARYY
router.get(
  '/',
  bookingController.createBookingCheckout,
  authController.isLoggedIn,
  viewController.getOverview,
);
router.get('/tour/:slug', authController.isLoggedIn, viewController.getTour);
router.get('/login', authController.isLoggedIn, viewController.getLoginForm);
router.get('/me', authController.protect, viewController.getAccount);
router.get(
  '/my-bookings',
  authController.protect,
  viewController.getMyBookings,
);

module.exports = router;
