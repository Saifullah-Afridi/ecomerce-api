const User = require("../models/userModel");
const asyncErrorHandler = require("../middlwares/asyncErrorHandler");
const generateToken = require("../config/generateJWTToken");

exports.register = asyncErrorHandler(async (req, res, next) => {
  const email = req.body.email;
  const findUser = await User.findOne({ email });
  if (!findUser) {
    //if no use was found in database with that email
    //create new a user
    const user = await User.create(req.body);
    res.status(200).json({
      status: "successful",
      data: {
        user,
      },
    });
  } else {
    next(new Error("the user is already exist"));
  }
});

exports.logIn = asyncErrorHandler(async (req, res, next) => {
  // take the password and email from body
  const { email, password } = req.body;
  // if no password or email provided
  if (!email || !password) {
    return next(new Error("please provide email and password"));
  }
  const user = await User.findOne({ email });

  if (!user || !(await user.isPasswordMatch(password))) {
    return next(new Error("please provide correct email and password"));
  }
  const token = generateToken(user.id);
  res.status(200).json({
    status: "success",
    token,
  });
});

// get all user

exports.getAllUser = asyncErrorHandler(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    status: "success",
    data: {
      users,
    },
  });
});

//get single user

exports.getUser = asyncErrorHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new Error("this user does not exist"));
  }
  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});

// delete a user
exports.deleteUser = asyncErrorHandler(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) {
    return next(new Error("this user does not exist"));
  }
  res.status(200).json({
    status: "success",
    message: "the user has been deleted",
    data: {
      user,
    },
  });
});

// update a user

exports.updateUser = asyncErrorHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      mobile: req.body.mobile,
    },
    {
      new: true,
      runValidators: true,
    }
  );
  if (!user) {
    return next(new Error("this user does not exist"));
  }
  res.status(200).json({
    status: "success",
    message: "the user has been updated",
    data: {
      user,
    },
  });
});
