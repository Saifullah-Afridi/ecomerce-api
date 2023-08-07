const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const asyncErrorHandler = require("./asyncErrorHandler");
const { promisify } = require("util");

exports.protected = asyncErrorHandler(async (req, res, next) => {
  // 1) get the token and check it if it is there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(new Error("You are not allowed,please login first"));
  }

  //2) verify the token
  const payload = await promisify(jwt.verify)(token, process.env.SECRET_KEY);

  //   3) check if the user still exist
  const currentUser = await User.findById(payload.id);
  if (!currentUser) {
    return next(new Error("the user belonging to this token does not exist"));
  }

  //   4) check if the user change password after the user change password
  if (currentUser.changePasswordAfter(payload.iat)) {
    return next(new Error("User recently changed password,Please Login again"));
  }

  // adding user as property on request object

  req.user = currentUser;
  // grand access to protected routes
  next();
});

//checking for admin
exports.isAdmin = asyncErrorHandler(async (req, res, next) => {
  const { email } = req.user;
  console.log(req.user);
  const user = await User.findOne({ email });
  if (user.role !== "admin") {
    return next(new Error("You are not allowed to perform this action"));
  }
  next();
});

exports.blockUser = asyncErrorHandler(async (req, res, next) => {
  const { id } = req.params;
  const block = await User.findByIdAndUpdate(
    id,
    {
      isBlocked: true,
    },
    {
      new: true,
      runValidators: true,
    }
  );
  if (!block) {
    return next(new Error("no user found with the given id"));
  }
  res.status(200).json({
    status: "success",
    message: "the user has been blocked",
  });
});

exports.UnBlockUser = asyncErrorHandler(async (req, res, next) => {
  const { id } = req.params;
  const unblock = await User.findByIdAndUpdate(
    id,
    {
      isBlocked: false,
    },
    {
      new: true,
      runValidators: true,
    }
  );
  if (!unblock) {
    return next(new Error("no user found with the given id"));
  }
  res.status(200).json({
    status: "success",
    message: "the user has been unblocked",
  });
});
