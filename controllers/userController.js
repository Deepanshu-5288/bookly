import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import {User} from "../models/userModel.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import {sendToken} from "../utils/sendToken.js";
import sendEmail from "../utils/sendEmail.js";
import crypto from "crypto";

//register user
export const registerUser = catchAsyncError(async (req, res, next) =>{
    const {firstName, lastName, email, password} = req.body;
    if(!firstName || !lastName || !email || !password ){
        return next(new ErrorHandler(404, "Please fill all the fields"));
    }
    let user = await User.findOne({email});
    if(user){
        return next(new ErrorHandler(400, "User already exit with this email"));
    }
    user = await User.create({firstName, lastName, email, password});
    user.password = undefined;
    sendToken(res, user, `Welcome ${user.firstName}`, 200);
})

//login user
export const loginUser = catchAsyncError(async (req, res, next)=>{
    const {email, password} = req.body;
    if(!email || !password) {
        return next(new ErrorHandler(404, "Please fill all the fields"));
    }
    const user = await User.findOne({email}).select("+password");
    if(!user){
        return next(new ErrorHandler(400, "Email or password is not correct"));
    }
    const isPasswordMatched = await user.comparePassword(password);
    if(!isPasswordMatched){
        return next(new ErrorHandler(400, "Email or password is not correct"));
    }
    user.password = undefined;
    sendToken(res, user, `Welcome back ${user.firstName}`, 200);
})

//logout user



//update profile
export const updateUser = catchAsyncError(async (req,res,next) =>{
    const {firstName, lastName, email, location, dob} = req.body;
    const user = await User.findByIdAndUpdate(req.user._id, {firstName, lastName, email, location, dob, updatedAt:Date.now()}, {new:true})
    res.status(200).json({
        success:true,
        user
    })
})


//forget password
export const forgetPassword = catchAsyncError(async (req, res, next)=>{
    const {email} = req.body;
    if(!email){
        return next(new ErrorHandler(400, "Please enter email"))
    }
    const user = await User.findOne({email});
    if(!user){
        return next(new ErrorHandler(400, "Email is not correct"));
    }
    const resetToken = await user.getResetPasswordToken();
    await user.save({validateBeforeSave:false});

    const resetPasswordUrl = `${req.protocol}://${req.get("host")}/api/v1/auth/reset/${resetToken}`;

    const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\n If you have not requested it please ignore it.`;

    try {
        await sendEmail({
            email:user.email,
            subject:"Bookly reset password",
            message,
        })
        res.status(200).json({
            success:true,
            message:`Email sent to ${user.email} successfully`,
        })
    } catch (error) {
        user.resetPasswordExpire= undefined;
        user.resetPasswordToken = undefined;
        await user.save({validateBeforeSave:false});

        return next(new ErrorHandler(error.message, 500));
    }

})


//reset password
export const resetPassword = catchAsyncError(async (req, res, next)=>{
    const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex");
    
    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire:{$gt :Date.now()},
    });

    if(!user){
        return next(new ErrorHandler(400,"Reset password token is invalid or has been expired"))
    }
    if(!req.body.password || !req.body.confirmPassword){
        return next(new ErrorHandler(400,"please fill all fields"))
    }
    if(req.body.password !== req.body.confirmPassword){
        return next(new ErrorHandler(400,"password doesn't match"))
    }

    user.password = req.body.password;
    user.resetPasswordExpire= undefined;
    user.resetPasswordToken = undefined;
    await user.save();
    sendToken(res, user,"Password updated successfully", 200);
})


//update password
export const updatePassword = catchAsyncError(async (req, res, next)=>{
    const {oldPassword, newPassword, confirmPassword} = req.body;
    if(!oldPassword || !newPassword || !confirmPassword){
        return next(new ErrorHandler(404, "Please fill all the fields"));
    }
    let user = await User.findById(req.user._id).select("+password");
    if(!user){
        return next(new ErrorHandler(400, "Email or password is not correct"));
    }
    const isPasswordMatched = await user.comparePassword(oldPassword);
    if(!isPasswordMatched){
        return next(new ErrorHandler(400, "password is not correct"));
    }
    if(newPassword === oldPassword){
        return next(new ErrorHandler(400, "newPassword and confirmPassword cannot be same"));
    }
    if(newPassword !== confirmPassword){
        return next(new ErrorHandler(400, "newPassword and confirmPassword are not matching"));
    }
    user.password=newPassword;
    user.updatedAt=Date.now();
    await user.save();
    user = await User.findById(req.user._id);
    user.password = undefined;
    res.status(200).json({
        success:true,
        message:"Password updated successfully",
        user
    })
})

//get user details
export const getUserDetails = catchAsyncError(async (req, res, next)=>{
    const user = await User.findById(req.user._id);
    res.status(200).json({
        success:true,
        user
    })
})

//get all user ---admin
export const getAllUser = catchAsyncError(async (req, res, next)=>{
    const users = await User.find();
    res.status(200).json({
        success:true,
        users
    })
})

//delete user  ---admin
export const deleteUser = catchAsyncError(async (req, res, next)=>{
    const user = await User.findByIdAndDelete(req.params.id);
    if(!user){
        return next(new ErrorHandler(400, "No user to delete"))
    }
    res.status(200).json({
        success:true,
        message:"User deleted successfully"
    })
})

//update user role  ---admin
export const updateUserRole = catchAsyncError(async (req, res, next)=>{
    const user = await User.findById(req.params.id);
    if(!user){
        return next(new ErrorHandler(400, "no available user for selected ID"))
    }
    if(!req.body.role){
        return next(new ErrorHandler(400, "please all mandatory fields"))
    }
    user.role = req.body.role;
    await user.save();
    res.status(200).json({
        success:true,
        user,
        message:"User updated successfully"
    })
})
