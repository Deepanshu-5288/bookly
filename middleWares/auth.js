import { User } from "../models/userModel.js";
import jwt from "jsonwebtoken";
import { catchAsyncError } from "./catchAsyncError.js";
import ErrorHandler from "../utils/ErrorHandler.js";

export const isAuthenticated = catchAsyncError(async (req, res, next) =>{
    const token = req.headers.authorization.slice(7);
    if(!token){
        return next(new ErrorHandler(400, "Please login to update"));
    }
    const decodedData =  jwt.verify(token,  process.env.JWT_SECRET);
    req.user = await User.findById(decodedData._id);
    next(); 

})

export const isAuthorized = (...roles) =>{
    return catchAsyncError(async (req, res, next) =>{
    if(!roles.includes(req.user.role)){
        return next(new ErrorHandler(400, "Only authorized user can access this resource"))
    }
    next();
    })
}