import User from "../model/User.js";
import {validationResult} from 'express-validator';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import { sendOTPEmail } from "../utils/helpers/emailHelper.js";


 export const getAllUsers= async(req,res,next)=>{
    let users;
    try{
       users=await User.find();
    }catch(err){
        console.log(err);
    }
    if(!users){
        return res.status(404).json({message:"No Users Found"});
    }
    return res.status(200).json({users});
}



export const signUp=async(req,res)=>{
   
    const{username,email,password}=req.body;
    
    //handling  validation errors
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }

    try{
        let user=await User.findOne({email});
        if(user){
            return res.status(400).json({message:'User already exists'});
        }

        //generating otp
        const otp=Math.floor(10000+Math.random()*90000).toString();
        const otpExpires=Date.now() + 2 * 60 * 1000;

        //hashing password
        const salt=await bcrypt.genSalt(10);
        const hashedPassword=await bcrypt.hash(password,salt);

        user= new User({
            username,
            email:email,
            password:hashedPassword,
            otp,
            otpExpires
        })
        await user.save();

        //sending otp via mail

        try {
            await sendOTPEmail(email, otp);
            res.status(200).json({ message: 'OTP sent to email, please verify your OTP' });
          } catch (emailError) {
            console.error(emailError.message);
            res.status(500).send('Error sending OTP');
          }
      
        } catch (error) {
          console.error(error.message);
          res.status(500).send('Server error');
        }
      };

    

