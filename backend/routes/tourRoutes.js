const express = require("express");
const tourController = require("../controllers/tourController");
const authController = require("../controllers/authenticationController");
const reviewRouter = require("../routes/reviewRoutes");

const router = express.Router();
router
  .route("/monthly-plan")
  .get(
    authController.restrictTo("admin", "lead-guide", "guide"),
    tourController.getMonthlyPlan
  );
router.get("/homepage-stats", tourController.getHomepageStats);
router
  .route("/top-5-cheap")
  .get(tourController.aliasTopTour, tourController.getAllTours);
//every time na may api/v1/tour/{tourId}/reviews
//dito ma roroute para madala yung id sa kabilang router, in this case reviewroute
router.get("/slug/:slug", tourController.getTourBySlug);
router.use("/:tourId/reviews", reviewRouter);
router.get("/countries", tourController.getAllCountries);

router
  .route("/tours-within/:distance/center/:latlong/unit/:unit")
  .get(tourController.getToursWithin);
router.route("/distance/:latlong/unit/:unit").get(tourController.getDistances);
// router.use(authController.protect);
router.route("/tour-stats").get(tourController.getTourStats);

router
  .route("/")
  .get(tourController.getAllTours)
  .post(
    authController.restrictTo("admin", "lead-guide"),
    tourController.createTour
  );

router
  .route("/:id")
  .get(tourController.getTour)
  .patch(
    authController.restrictTo("admin", "lead-guide"),
    tourController.uploadTourImages,
    tourController.resizeTourImages,
    tourController.updateTour
  )
  .delete(
    authController.restrictTo("admin", "lead-guide"),
    tourController.deleteTour
  );
module.exports = router;
