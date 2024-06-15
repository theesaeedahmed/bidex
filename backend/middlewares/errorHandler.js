// Define a global error handling middleware

const devErrors = (res, err) => {
  res.status(err.statusCode).json({
    message: err.message,
    status: err.statusCode,
    error: err,
    stackTrace: err.stack,
  });
};

const prodErrors = (res, err) => {
  if (err.isOperational) {
    res
      .status(err.statusCode)
      .json({ message: err.message, statusCode: err.statusCode });
  } else {
    res.status(500).json({
      status: "error",
      message: "Something went wrong. Please try again later.",
    });
  }
};

const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";

  res.setHeader("Content-Type", "application/json");

  console.error(err);

  if (process.env.DEPLOYMENT_MODE === "development") {
    return devErrors(res, err);
  } else if (process.env.DEPLOYMENT_MODE === "production") {
    return prodErrors(res, err);
  }
};

module.exports = errorHandler;
