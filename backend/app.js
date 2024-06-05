import express from 'express';
import mongoose from 'mongoose'
import connectDB from './config/db.js';
import dotenv from 'dotenv'
const app= express();

dotenv.config();

connectDB();

app.use("/",(req,res,next)=>{
    res.send("Hello world")
});

app.listen(3000);