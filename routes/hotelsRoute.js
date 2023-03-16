import express from "express";
import { addHotel, deleteAdminHotel, deleteHotel, editHotel, getHotels, getSingleHotel, getVendorHotel } from "../controllers/hotelController.js";
import {isAuthenticated, isAuthorized} from "../middlewares/auth.js";
const router = express.Router();


router.route("/hotels").get(getHotels);
router.route("/hotel/:id").get(getSingleHotel);

router.route("/vendor/hotels").get(isAuthenticated,isAuthorized("vendor"), getVendorHotel);
router.route("/vendor/hotel").post(isAuthenticated,isAuthorized("vendor"), addHotel).patch(isAuthenticated,isAuthorized("vendor"), editHotel);
router.route("/vendor/hotel/:id").delete(isAuthenticated,isAuthorized("vendor"), deleteHotel);

router.route("/admin/hotel/:id").delete(isAuthenticated, isAuthorized("admin"), deleteAdminHotel);



export default router;