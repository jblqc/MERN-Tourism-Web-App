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
const packageRouter = require("./routes/packageRoutes");
const stripeController = require("./controllers/bookingController");


const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

const app = express();

app.use(
  cors({
    origin: "https://mern-tourism-web-app-fe.onrender.com",
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

// FULLY DISABLE COOP for Google Login
app.use((req, res, next) => {
  res.removeHeader("Cross-Origin-Opener-Policy");
  res.removeHeader("Cross-Origin-Embedder-Policy");
  next();
});
// View engine
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

// Static files
app.use(express.static(path.join(__dirname, "public")));

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
app.post(
  "/webhook/stripe",
  express.raw({ type: "application/json" }),
  stripeController.webhookCheckout
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
app.use("/api/v1/packages", packageRouter);
 
// Handle unhandled routes
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(errorController);

module.exports = app;
