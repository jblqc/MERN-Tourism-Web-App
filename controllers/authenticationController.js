const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const crypto = require('crypto');
const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const Email = require('../utils/email');
const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000,
    ),
    httpOnly: true,
    sameSite: 'Lax', // always fine for dev
    secure: process.env.NODE_ENV === 'production',
  };

  res.cookie('jwt', token, cookieOptions);
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: { user },
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  // const newUser = await User.create({
  //   name: req.body.name,
  //   email: req.body.email,
  //   password: req.body.password,
  //   passwordConfirm: req.body.passwordConfirm,
  //   passwordChangedAt: req.body.passwordChangedAt,
  // });
  const newUser = await User.create(req.body);
  const url = `${req.protocol}://${req.get('host')}/me`;
  console.log(url);
  await new Email(newUser, url).sendWelcome();
  createSendToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new AppError('Email or password missing', 400);
  }
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.isValidPassword(password, user.password))) {
    throw new AppError('Invalid email or password', 401);
  }
  createSendToken(user, 200, res);
});
exports.logout = (req, res) => {
  console.log('Logging out...');
  console.log('NODE_ENV:', process.env.NODE_ENV);
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
    sameSite: 'Lax', // always fine for dev
    secure: process.env.NODE_ENV === 'production',
  });
  res.status(200).json({ status: 'success' });
};

exports.protect = catchAsync(async (req, res, next) => {
  //user must be login
  //1. get the token chekc if exist
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token || token === 'loggedout') {
    return next(
      new AppError('You are not logged in! Please log in to get access', 401),
    );
  }

  //2. validate the token if expire or not malicious
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  //3. if succesfull, check  if user still exist
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError('The user belonging to this token no longer exist.', 401),
    );
  }
  //4. check if user changed pass after token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed password! Please log in again', 401),
    );
  }
  //grant access to protected route!
  req.user = currentUser;
  res.locals.user = currentUser;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permsssion to perform this action', 403),
      );
    }
    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1. Get user based on email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('User does not exist!', 404));
  }

  // 2. Generate random token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  try {
    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;
    await new Email(user, resetUrl).sendPasswordReset();
    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!',
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    return next(new AppError('There was an error sending the email', 500));
  }
});
exports.resetPassword = catchAsync(async (req, res, next) => {
  //get the user based on token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');
  //only if token is not expired and there is user, set the new pass

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: {
      $gt: Date.now(),
    },
  });

  if (!user) {
    return next(new AppError('Token is invalid or has expired', 400));
  }
  //automaticallyv alidated by the model
  //update the changepasswordar property for the user

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();
  //log the user in send jwt
  createSendToken(user, 200, res);
});
exports.updatePassword = catchAsync(async (req, res, next) => {
  //get user
  //detect if password is correct

  const user = await User.findById(req.user.id).select('+password');

  if (!(await user.isValidPassword(req.body.passwordCurrent, user.password))) {
    throw new AppError('Your password is wrong', 401);
  } //if correct then, update!
  //user.findbyidandupdate will not work
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();
  createSendToken(user, 200, res);
});
//onlyfor renderedpages, no error
exports.isLoggedIn = catchAsync(async (req, res, next) => {
  if (req.cookies.jwt && req.cookies.jwt !== 'loggedout') {
    try {
      token = req.cookies.jwt;

      //2. validate the token if expire or not malicious
      const decoded = await promisify(jwt.verify)(
        token,
        process.env.JWT_SECRET,
      );

      //3. if succesfull, check  if user still exist
      const currentUser = await User.findById(decoded.id);
      if (!currentUser) {
        return next();
      }
      //4. check if user changed pass after token was issued
      if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next();
      }
      //tehre is alogged inuser,makeit accesssibletoviews
      res.locals.user = currentUser;
      return next();
    } catch (err) {
      return next();
    }
  }
  next();
});
