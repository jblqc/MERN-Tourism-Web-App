const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Tour = require("../models/tourModel");
const AppError = require("../utils/appError");
const Booking = require("../models/bookingModel");
const catchAsync = require("../utils/catchAsync");
const factory = require("./handlerFactory");

/* ======================================================
   CREATE STRIPE CHECKOUT SESSION
====================================================== */
exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.tourId);
  if (!tour) {
    return next(new AppError("No tour found with that ID", 404));
  }

  console.log("➡️ getCheckoutSession REQ.USER =", req.user);

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",

    // 👉 redirect only for UX
    success_url: `https://mern-tourism-web-app-fe.onrender.com/me?success=true`,
    cancel_url: `https://mern-tourism-web-app-fe.onrender.com/tours/${tour.slug}`,

    customer_email: req.user.email,
    client_reference_id: req.params.tourId,

    // ✅ REQUIRED FOR WEBHOOK
    metadata: {
      tourId: req.params.tourId,
      userId: req.user.id,
    },

    line_items: [
      {
        price_data: {
          currency: "usd",
          unit_amount: tour.price * 100,
          product_data: {
            name: `${tour.name} Tour`,
            description: tour.summary,
            images: [`https://www.natours.dev/img/tours/${tour.imageCover}`],
          },
        },
        quantity: 1,
      },
    ],
  });

  res.status(200).json({
    status: "success",
    url: session.url,
  });
});

/* ======================================================
   STRIPE WEBHOOK (BOOKING IS CREATED HERE)
====================================================== */
exports.webhookCheckout = async (req, res) => {
  const sig = req.headers["stripe-signature"];

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("❌ Webhook signature failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    await Booking.create({
      tour: session.metadata.tourId,
      user: session.metadata.userId,
      price: session.amount_total / 100,
      paid: true,
      stripeSessionId: session.id,
    });

    console.log("✅ Booking created from Stripe webhook");
  }

  res.status(200).json({ received: true });
};
exports.getMyBookings = catchAsync(async (req, res, next) => {
  const bookings = await Booking.find({ user: req.user.id })
    .populate('tour');

  res.status(200).json({
    status: 'success',
    results: bookings.length,
    data: {
      bookings,
    },
  });
});

/* ======================================================
   FACTORY CRUD (UNCHANGED)
====================================================== */
exports.createBooking = factory.createOne(Booking);
exports.getBooking = factory.getOne(Booking);
exports.getAllBookings = factory.getAll(Booking);
exports.updateBooking = factory.updateOne(Booking);
exports.deleteBooking = factory.deleteOne(Booking);
