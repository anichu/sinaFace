const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
	firstName: {
		type: String,
		required: true,
	},
	lastName: {
		type: String,
		required: true,
	},
	userName: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
	},
	password: {
		type: String,
		required: true,
	},
	profileImage: Array,
	coverImage: Array,
	friends: Array,
	requestedTo: Array,
	bio: {
		type: String,
	},
	birthDate: Date,
	gender: {
		type: String,
	},
	religoin: {
		type: String,
	},
	status: {
		type: String,
	},
	resetPasswordToken: String,
	resetPasswordExpire: Date,
});

userSchema.pre("save", async function (next) {
	if (!this.isModified("password")) {
		next();
	}

	const salt = await bcrypt.genSalt(10);

	this.password = await bcrypt.hash(this.password, salt);

	next();
});

userSchema.methods.matchPasswords = async function (password) {
	return await bcrypt.compare(password, this.password);
};

userSchema.methods.getSignedToken = function () {
	return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
		expiresIn: process.env.EXPIRED_DATE,
	});
};

userSchema.methods.getResetPasswordToken = function () {
	const resetToken = crypto.randomBytes(20).toString("hex");
	this.resetPasswordToken = crypto
		.createHash("sha256")
		.update(resetToken)
		.digest("hex");

	this.resetPasswordExpire = Date.now() + 10 * (60 * 1000);

	return resetToken;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
