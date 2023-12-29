const ErrorResponse = require("../utils/errorResponse");

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
  console.log(err.stack);
  console.log("Error Message", error);

  // File Not Found Error
  if (err.errno === -4058 || err.code === "ENOENT") {
    const message = "File or Directory Not Found";
    error = new ErrorResponse(message, 400);
  } 
  // Invalid Arguments error
  else if (err.code === "ERR_INVALID_ARG_TYPE") {
    const message = "Invalid Arguments";
    error = new ErrorResponse(message, 400);
  } 
  // operation not permitted error
  else if (err.errno === -4048 || err.code === "EPERM") {
    const message = "Operation not permitted";
    error = new ErrorResponse(message, 400);
  }
  // File larger than limit error
  else if(err.code==='LIMIT_FILE_SIZE'){
    const message="Please upload the file upto 25 mb"
    error=new ErrorResponse(message,400)
  }

  res.status(error.statusCode || 500).json({
    success: false,
    statusCode: error.statusCode || 500,
    error: error.message || "Server error",
  });
};

module.exports = errorHandler;

