import express from 'express';
import { signUpValidation } from '../middleware/validation.js';
import {getAllUsers,signUp} from '../controllers/user-controller.js';


const userRouter=express.Router();

userRouter.get('/',getAllUsers);

userRouter.post('/signup',signUpValidation,signUp)



export default  userRouter;
