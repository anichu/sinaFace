const ErrorResponse = require("../utlis/errorResponse");

exports.notFound = (req, res, next) => {
	return next(new ErrorResponse(`Not Found - ${req.originalUrl}`, 400));
};

exports.errorHandler = (err, req, res, next) => {
	let error = { ...err };
	error.message = err.message;

	res.status(error.statusCode || 500).json({
		error: error.message || "Server Error",
	});
};
