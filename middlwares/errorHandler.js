exports.notFound = (req, res, next) => {
  const err = new Error(`the requested ${req.originalUrl} not found`);
  err.statusCode = 404;
  err.status = res.status(404).json({
    status: "fail",
    message: err.message,
  });
  next(error);
};

exports.globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    stack: err.stack,
  });
};
