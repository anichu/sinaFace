const User = require("../models/user");
const ErrorResponse = require("../utlis/errorResponse");
const jwt = require("jsonwebtoken");

exports.protect = async (req, res, next) => {
	let token;
	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith("Bearer")
	) {
		token = req.headers.authorization.split(" ")[1];
	}

	if (!token) {
		return next(new ErrorResponse("Not authorized to access this route", 401));
	}
	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		const user = await User.findById(decoded.id);
		if (!user) {
			return next(new ErrorResponse("No user found for this is", 404));
		}

		req.user = user;
		next();
	} catch (err) {
		return next("Not authorized to access this route", 401);
	}
};

exports.admin = async (req, res, next) => {
	if (req.user.isAdmin) {
		next();
	} else {
		return next("Not authorized to access this route", 401);
	}
};
