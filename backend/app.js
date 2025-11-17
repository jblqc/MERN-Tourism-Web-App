const path = require("path");
const cors = require("cors");
const express = require("express");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const cookieParser = require("cookie-parser");
const AppError = require("./utils/appError");
const errorController = require("./controllers/errorController");
const compression = require("compression");
const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoutes");
const reviewRouter = require("./routes/reviewRoutes");
const viewRouter = require("./routes/viewRoutes");
const bookingRouter = require("./routes/bookingRoutes");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
// Disable only the things that break Google Login
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
    crossOriginOpenerPolicy: false,
    crossOriginResourcePolicy: false,
    frameguard: false,
  })
);

// REQUIRED for popup login
app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
  next();
});
// View engine
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

// Static files
app.use(express.static(path.join(__dirname, "public")));
// app.use(
//   helmet.contentSecurityPolicy({
//     directives: {
//       defaultSrc: ["'self'"],
//       scriptSrc: [
//         "'self'",
//         "'unsafe-eval'", // 🧩 allow Parcel’s eval() scripts
//         "'unsafe-inline'", // 🧩 allow inline bootstrap for HMR
//         "https://js.stripe.com",
//         "https://accounts.google.com", // ⭐ REQUIRED
//         "https://www.gstatic.com",
//         "https://api.mapbox.com",
//         "https://cdnjs.cloudflare.com",
//         "blob:",
//       ],
//       scriptSrcElem: [
//         "'self'",
//         "'unsafe-inline'",
//         "'unsafe-eval'",
//         "https://js.stripe.com",
//         "https://api.mapbox.com",
//         "https://accounts.google.com/*",
//         "https://www.gstatic.com",
//         "https://cdnjs.cloudflare.com",
//         "blob:",
//       ],
//       styleSrc: [
//         "'self'",
//         "https://api.mapbox.com",
//         "https://fonts.googleapis.com",
//         "'unsafe-inline'",
//       ],
//       fontSrc: ["'self'", "https://fonts.gstatic.com"],
//       imgSrc: [
//         "'self'",
//         "data:",
//         "https://api.mapbox.com",
//         "https://events.mapbox.com",
//         "https://lh3.googleusercontent.com",
//       ],
//       connectSrc: [
//         "'self'",
//         "https://api.mapbox.com",
//         "https://events.mapbox.com",
//         "https://js.stripe.com",
//         "https://r.stripe.com",
//         "http://localhost:*",
//         "ws://localhost:*",
//         "ws://127.0.0.1:*",
//       ],
//       frameSrc: [
//         "'self'",
//         "https://js.stripe.com",
//         "https://accounts.google.com/*",
//       ],
//       workerSrc: ["'self'", "blob:"],
//       referrerPolicy: {
//         policy: "strict-origin-when-cross-origin",
//       },
//     },
//   })
// );

// Logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Rate Limiting
app.use(
  "/api",
  rateLimit({
    max: 1000,
    windowMs: 60 * 60 * 1000,
    message: "Too many requests from this IP, please try again in an hour!",
  })
);

// Body parser
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());

// Data sanitization
app.use(mongoSanitize());
app.use(xss());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      "duration",
      "ratingsQuantity",
      "ratingsAverage",
      "maxGroupSize",
      "difficulty",
      "price",
    ],
  })
);
app.use(compression());

// Custom middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  res.locals.STRIPE_PUBLIC_KEY = process.env.STRIPE_PUBLIC_KEY;

  next();
});

// Routers
app.use("/", viewRouter);

app.use("/api/v1/users", userRouter);
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/reviews", reviewRouter);
app.use("/api/v1/booking", bookingRouter);

// Handle unhandled routes
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(errorController);

module.exports = app;
