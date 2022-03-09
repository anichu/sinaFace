const express = require("express");
const colors = require("colors");
const app = express();
const connectDB = require("./config/db");
require("dotenv").config({ path: "./config.env" });

// Connect to MongoDB
connectDB();

const PORT = process.env.PORT || 5000;

app.use("/me", (req, res, next) => {
	res.send("anis molla");
});

app.listen(PORT, () =>
	console.log(`Server running on port ${PORT}🚀🚀🚀🚀`.underline.cyan.bold)
);
