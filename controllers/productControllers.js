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
  const products = await Product.find();
  res.status(200).json({
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
