const User = require("../models/user");
const ErrorResponse = require("../utlis/errorResponse");
const sendEmail = require("../utlis/sendEmail");
const crypto = require("crypto");

// @desc Registered User
// @route POST /api/users
// @access Public

exports.register = async (req, res, next) => {
	const { firstName, lastName, email, password, userName, gender } = req.body;

	try {
		const existUser = await User.findOne({ userName });
		if (existUser) {
			return next(new ErrorResponse("username already exist😂😂", 409));
		}
		const existEmail = await User.findOne({ email });
		if (existEmail) {
			return next(new ErrorResponse("Email already exist😂😂", 409));
		}
		const user = await User.create({
			firstName,
			lastName,
			email,
			userName,
			password,
			gender,
		});

		sendToken(user, 201, res);
	} catch (err) {
		next(err);
	}
};

// @desc Login User
// @route POST /api/users/login
// @access Public

exports.login = async (req, res, next) => {
	const { email, password } = req.body;

	try {
		const user = await User.findOne({ email });
		if (!user) {
			return next(new ErrorResponse("User is not found 😂😂", 404));
		}

		const isMatch = await user.matchPasswords(password);

		if (!isMatch) {
			return next(new ErrorResponse("Invalid password or email 😂😂", 401));
		}

		sendToken(user, 200, res);
	} catch (err) {
		next(err);
	}
};

// @desc Forgot Password
// @route Post /api/users/forgotpassword
// @access Public

exports.forgotpassword = async (req, res, next) => {
	try {
		const { email } = req.body;
		const user = await User.findOne({ email });
		if (!user) {
			return next(new ErrorResponse("Email could not be sent", 404));
		}

		const resetToken = user.getResetPasswordToken();

		await user.save();

		const resetUrl = `http://localhost:3000/passwordreset/${resetToken}`;

		const message = `
    <h1>You have requested a password reset</h1>
    
    <p>Please go to this link to reset your password</p>

    <a href=${resetUrl} clicktracking=off>${resetUrl}</a>
    `;
		try {
			await sendEmail({
				to: user.email,
				subject: "Password Reset Token",
				text: message,
			});

			res.status(200).json({
				data: "Email sent",
			});
		} catch (err) {
			user.resetPasswordToken = undefined;
			user.resetPasswordExpire = undefined;
			await user.save();
			return next(new ErrorResponse("Email could not be sent", 500));
		}
	} catch (err) {
		next(err);
	}
};

// @desc Reset Password
// @route Post /api/users/resetpassword/:resetToken
// @access public

exports.resetpassword = async (req, res, next) => {
	const resetToken = req.params.resetToken;
	const { password } = req.body;

	const resetPasswordToken = crypto
		.createHash("sha256")
		.update(resetToken)
		.digest("hex");

	try {
		const user = await User.findOne({
			resetPasswordToken,
			resetPasswordExpire: {
				$gt: Date.now(),
			},
		});

		if (!user) {
			return next(new ErrorResponse("Invalid Reset Token", 400));
		}

		user.password = password;
		user.resetPasswordToken = undefined;
		user.resetPasswordExpire = undefined;
		await user.save();

		res.status(201).json({
			data: "Password Reset Success",
		});
	} catch (err) {
		next(err);
	}
};

const sendToken = (user, statusCode, res) => {
	const token = user.getSignedToken();
	res.status(statusCode).json({ user, token });
};
