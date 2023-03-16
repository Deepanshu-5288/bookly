import mongoose from "mongoose";

const hotelSchema =new  mongoose.Schema({
    name:{
        type:String,
        required:[true, "Please enter hotel name"],
        trim:true

    },
    description:{
        type:String,
        required:[true, "Please enter hotel description"],
    },
    rooms:[
        {
            name:{
                type:String,
                required:[true, "Please enter the room type"]
            },
            cost:[{price:{
                type:Number,
                required:[true, "Please enter room price"],
            },
            type:{
                type:String,
                required:[true, "Please enter the price type"]
            }
            }],
            category:{
                type:String,
                required:[true, "Please enter the room category"]
            },
            status:{
                type:String,
                required:[true, "Please enter the room status"]
            },
            quantity:{
                type:Number,
                required:[true, "Please enter room quantity"],
            }
        }
    ],
    ratings:{
        type:Number,
        default:0
    },
    images:[
       { public_id:{
            type:String,
            required:true,
        },
        url:{
            type:String,
            required:true,
        }}
    ],
    category:[{
        type:String,
        required:[true, "Please enter hotel category"],
    }],
    location:{
        type:String,
        required:[true, "Please enter hotel location"],
    },
    amenities:[
        {name:{
            type:String,
            required:[true, "Please enter minimum of one amenities"],
        },
        tag:{
            type:String,
            required:[true, "Please select one of the tag for amenities"],
        }
    }],
    hotelPolicy:[
       {
            type:String,
            required:[true, "Please enter hotel policy"],
        },
    ],
    cancelPolicy:[
        {
             type:String,
             required:[true, "Please enter hotel policy"],
         },
     ],
     placeOfInterest:[
        {
             type:String,
         },
     ],
    numOfReviews:{
        type:Number,
        default:0
    },
    reviews:[
        {
            user:{
                type:mongoose.Schema.ObjectId,
                ref:"User",
                required:true,
            },
            name:{
                type:String,
                required:true,
            },
            rating:{
                type:Number,
                required:true,
            },
            comment:{
                type:String,
                required:true,
            }
        }
    ],
    user_id:{
        type:mongoose.Schema.ObjectId,
        ref:"User",
        required:true,
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    updatedAt:{
        type:Date,
        default:Date.now
    }

});

export const Hotel = mongoose.model("Hotel", hotelSchema);