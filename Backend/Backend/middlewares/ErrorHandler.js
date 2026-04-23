const ErrorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  // Log the error for the developer to see
  console.error("Error Log:", message);

  res.status(statusCode).json({
    success: false,
    message: message,
  });
};

export default ErrorHandler;
