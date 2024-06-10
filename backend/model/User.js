import mongoose from "mongoose"

const userSchema= new mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
   
    password:{
        type:String,
        required:true,
        minlength:6
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    otp:{
        type:String
    },
    otpExpires:{
        type:Date
    }
})

export default mongoose.model("User",userSchema);