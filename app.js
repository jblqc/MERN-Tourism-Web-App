const path = require('path');
const cors = require('cors');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const { helmet } = require('./public/js/helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const AppError = require('./utils/appError');
const errorController = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const viewRouter = require('./routes/viewRoutes');
const cookieParser = require('cookie-parser');
const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// 1. MIDLLEWARES
//serving sttaicc files
app.use(express.static(path.join(__dirname, 'public')));

//security middlewares for http
app.use(helmet);
//dev logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
//100 req per hourlimit req
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many request from this IP, please try again in an hour!',
});
app.use('/api', limiter);
//body parser, reading data from body into req.body
app.use(
  express.json({
    limit: '10kb',
  })
);
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());
//data sanitization again nosql query injection and
app.use(mongoSanitize());
//data sanitization for xss
app.use(xss());
//prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  })
);
const allowedOrigins = [process.env.APP_URL];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

//test middleswares
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});
app.use('/', viewRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/reviews', reviewRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Cant find ${req.originalUrl} on this server`, 404));
});
app.use(errorController);
module.exports = app;
