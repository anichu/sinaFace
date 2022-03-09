const mongoose = require("mongoose");

const connectDB = async () => {
	try {
		const conn = await mongoose.connect(process.env.MONGOURI);

		console.log(
			`mongoDB Connnected: ${conn.connection.host} 🔥🔥🔥🔥 `.underline.yellow
				.bold
		);
	} catch (err) {
		console.log(`Mongoose Error:${err.message}`.underline.red.bold);
		process.exit(1);
	}
};

module.exports = connectDB;
