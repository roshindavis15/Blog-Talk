import express from 'express';
import { signUpValidation } from '../middleware/validation.js';
import {getAllUsers,signUp,verifyOTP,login,logout} from '../controllers/user-controller.js';


const userRouter=express.Router();

userRouter.get('/',getAllUsers);

userRouter.post('/signup',signUpValidation,signUp)

userRouter.post('/verify-otp',verifyOTP);

userRouter.post('/login',login)

userRouter.post('/logout',logout)



export default  userRouter;
