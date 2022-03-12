const express = require("express");
const {
	register,
	login,
	forgotpassword,
	resetpassword,
} = require("../controllers/user");
const { protect } = require("../middleware/auth");
const router = express.Router();

router.route("/").post(register);
router.route("/login").post(login);
router.route("/forgotpassword").post(forgotpassword);
router.route("/resetpassword/:resetToken").post(resetpassword);

module.exports = router;
