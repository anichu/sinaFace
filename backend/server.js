const express = require("express");
const colors = require("colors");
const cors = require("cors");
const morgan = require("morgan");
const app = express();
const connectDB = require("./config/db");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const userRouter = require("./routes/user");
require("dotenv").config({ path: "./config.env" });

// Connect to MongoDB
connectDB();

if (process.env.NODE_ENV === "development") {
	app.use(morgan("dev"));
}

app.use(express.json());

app.use(cors());

const PORT = process.env.PORT || 5000;

app.use("/api/users", userRouter);

app.use("/me", (req, res, next) => {
	res.send("anis molla");
});

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () =>
	console.log(`Server running on port ${PORT}🚀🚀🚀🚀`.underline.cyan.bold)
);
