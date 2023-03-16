import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import {Hotel} from "../models/hotelModel.js";
import ErrorHandler from "../utils/ErrorHandler.js";


// add hotel --vendor
export const addHotel = catchAsyncError(async (req, res, next) =>{
    const {name, description, rooms, images, category, location, amenities, hotelPolicy, cancelPolicy} = req.body;
    if(!name || !description || !rooms || !images || !category || !location || !amenities || !hotelPolicy || !cancelPolicy ){
        return next(new ErrorHandler(404, "Please fill all the fields"));
    }
    let hotel = await User.findOne({name});
    if(hotel){
        return next(new ErrorHandler(400, "hotel already exit with this name"));
    }
    hotel = await Hotel.create({name, description, rooms, images, category, location, amenities, hotelPolicy, cancelPolicy});
    res.status(200).json({
        success:true,
        message:"Hotel added successfully"
    })
})

//edit hotel --vendor
export const editHotel = catchAsyncError(async (req, res, next) =>{
    const hotelDetails = req.body;
    const hotel = await Hotel.findOneAndUpdate ({_id:hotelDetails.id, user_id:req.user._id}, hotelDetails, {new:true});
    if(!hotel){
        return next(new ErrorHandler(400, "hotel doesn't exit or you are not authorized to update this hotel"));
    }
    res.status(200).json({
        success:true,
        message:"Hotel updated successfully",
        hotel
    })
})

//delete hotel --vendor
export const deleteHotel = catchAsyncError(async (req, res, next)=>{
    const hotel = await Hotel.findOneAndDelete({_id:req.params.id, user_id:req.user._id});
    if(!hotel){
        return next(new ErrorHandler(404, "You are not authorized to delete this hotel"))
    }
    res.status(200).json({
        success:true,
        message:"Hotel deleted successfully"
    })
})

//delete hotel --admin
export const deleteAdminHotel = catchAsyncError(async (req, res, next)=>{
    const hotel = await Hotel.findOneAndDelete({_id:req.params.id});
    if(!hotel){
        return next(new ErrorHandler(404, "You are not authorized to delete this hotel"))
    }
    res.status(200).json({
        success:true,
        message:"Hotel deleted successfully"
    })
})

//get vendor hotels
export const getVendorHotel = catchAsyncError(async (req, res, next)=>{
    const hotel = await Hotel.find({user_id:req.user._id});
    if(!hotel){
        return next(new ErrorHandler(404, "Requested Hotel is not present"))
    }
       res.status(200).json({
           success:true,
           hotel,
       })
   })

//get all hotels 
export const getHotels = catchAsyncError(async (req, res, next)=>{
 const hotels = await Hotel.find();


    res.status(200).json({
        success:true,
        hotels,
    })
})

//get single hotel
export const getSingleHotel = catchAsyncError(async (req, res, next)=>{
    const hotel = await Hotel.findById(req.params.id);
    if(!hotel){
        return next(new ErrorHandler(404, "Requested Hotel is not present"))
    }
       res.status(200).json({
           success:true,
           hotel,
       })
   })