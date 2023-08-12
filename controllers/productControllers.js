const Product = require("../models/productModel");
const asyncErrorHandler = require("../middlwares/asyncErrorHandler");

exports.cretaeProduct = asyncErrorHandler(async (req, res, next) => {
  const product = await Product.create(req.body);
  res.status(201).json({
    status: "success",
    data: {
      product,
    },
  });
});

exports.getAllProducts = asyncErrorHandler(async (req, res, next) => {
  const queryObj = { ...req.query };
  const excludedField = ["page", "sort", "fields", "limit"];
  excludedField.forEach((el) => delete queryObj[el]);

  // const products = await Product.find(queryObj);
  //buidling a query which will return a query

  // advance filtering includeing operator including gte lt lte gte

  let queryString = JSON.stringify(queryObj);
  queryString = queryString.replace(
    /\b(gte|gt|lte|lt)\b/g,
    (match) => `$${match}`
  );
  queryString = JSON.parse(queryString);

  let query = Product.find(queryString);
  //*****************************sorting****************************
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    query = query.sort(sortBy);
  } else {
    query = query.sort("-createdAt");
  }

  //limiting fiedls

  if (req.query.fields) {
    const fields = req.query.fields.split(",").join(" ");
    query = query.select(fields);
  } else {
    query = query.select("-__v");
  }

  //pagination
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 50;
  const skip = (page - 1) * limit;
  query = query.skip(skip).limit(limit);

  if (req.query.page) {
    const numOfProducts = await Product.countDocuments();
    if (skip >= numOfProducts) {
      return next(new Error("this page does not exist"));
    }
  }
  //executing query
  const products = await query;

  //sending response
  res.status(200).json({
    totel: products.length,
    status: "success",
    data: {
      products,
    },
  });
});

exports.getProduct = asyncErrorHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(new Error("this product does not exist"));
  }
  res.status(200).json({
    status: "success",
    data: {
      product,
    },
  });
});

exports.deleteProduct = asyncErrorHandler(async (req, res, next) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) {
    return next(new Error("this product does not exist"));
  }
  res.status(200).json({
    status: "success",
    message: "the product has been deleted",
    data: {
      product,
    },
  });
});

exports.updateProduct = asyncErrorHandler(async (req, res, next) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!product) {
    return next(new Error("this product does not exist"));
  }
  res.status(200).json({
    status: "success",
    message: "the product has been updated",
    data: {
      product,
    },
  });
});
