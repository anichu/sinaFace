const mongoose = require("mongoose");

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
});

const User = mongoose.model("User", userSchema);

module.exports = User;
