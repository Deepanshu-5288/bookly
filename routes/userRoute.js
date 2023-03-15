import express from "express";
import { deleteUser, forgetPassword, getAllUser, getUserDetails, loginUser, registerUser, resetPassword, updatePassword, updateUser, updateUserRole } from "../controllers/userController.js";
import {isAuthenticated, isAuthorized} from "../middlewares/auth.js";
const router = express.Router();

router.route("/auth/register").post(registerUser);
router.route("/auth/login").post(loginUser);
router.route("/auth/forget").post(forgetPassword);
router.route("/auth/reset/:token").post(resetPassword);
router.route("/auth/update").patch(isAuthenticated, updatePassword);


router.route("/me").get(isAuthenticated, getUserDetails);
router.route("/me/update").patch(isAuthenticated, updateUser);


router.route("/admin/all-users").get(isAuthenticated, isAuthorized("admin"), getAllUser);
router.route("/admin/delete-user/:id").get(isAuthenticated, isAuthorized("admin"), deleteUser);
router.route("/admin/update-user/:id").patch(isAuthenticated, isAuthorized("admin"), updateUserRole);
export default router;