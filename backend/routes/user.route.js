import express from "express";
import { login, logout, register, updateProfile,submitAssessment, adminLogin } from "../controllers/user.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { singleUpload } from "../middlewares/mutler.js";
 
const router = express.Router();

router.route("/register").post(singleUpload,register);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/profile/update").post(isAuthenticated,singleUpload,updateProfile);
router.route("/assessment/submit").post(isAuthenticated, submitAssessment);
router.route('/adminlogin').post(adminLogin)
export default router;

