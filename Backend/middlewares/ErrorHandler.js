// This is the Error CLASS used with "new ErrorHandler(message, statusCode)"
// Used inside BaseController and controllers to create errors passed to next()
class ErrorHandler extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.name = "ErrorHandler";
  }
}

export default ErrorHandler;