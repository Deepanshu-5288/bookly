import mongoose from "mongoose";
import validator from "validator";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import crypto from "crypto";

const userSchema =  mongoose.Schema({
    firstName:{
        type:String,
        required:[true, "Please enter your name"]
    },
    lastName:{
        type:String,
        required:[true, "Please enter your last name"],
        default:"Last name"
    },
    email:{
        type:String,
        required:[true, "please enter your email"],
        validate:validator.isEmail
    },
    password:{
        type:String,
        required:[true, "please enter your password"],
        minLength:[8, "Password cannot be less then 8 characters"],
        select:false
    },
    location:{
        type:String,
        required:[true, "Please enter your location"],
        default:"location"
    },
    role:{
        type:String,
        required:[true, "Please enter your role"],
        default:"user"
    },
    avatar:{
        public_id:{
            type:String,
            required:true,
        },
        url:{
            type:String,
            required:true
        }
    },
    dob:{
        type:Date,
        required:[true, "Please enter your date of birth"],
        default:Date.now()
    },
    createdAt:{
        type:Date,
        default:Date.now()
    },
    updatedAt:{
        type:Date,
        default:Date.now()
    },
    resetPasswordToken:String,
    resetPasswordExpire:Date,
})
userSchema.pre("save", async function(next){
    if(!this.isModified("password")){
        return next();
    }
    this.password = await bcrypt.hash(this.password, 10);
    next();
})

userSchema.methods.getJwtToken =  function() {
    return jwt.sign({_id:this._id}, process.env.JWT_SECRET, {
        expiresIn:process.env.JWT_EXPIRE
    })
}

userSchema.methods.comparePassword = async function(password){
    return await bcrypt.compare(password, this.password);
}

// generating password reset token
userSchema.methods.getResetPasswordToken = function (){
    //generating token
    const resetToken = crypto.randomBytes(20).toString("hex");

    //hashing and adding resetPasswordToke to UserSchema
    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    this.resetPasswordExpire = Date.now() + 15*60*1000;

    return resetToken;
}

export const User = mongoose.model("User", userSchema);