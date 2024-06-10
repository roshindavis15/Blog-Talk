import express from 'express';
import connectDB from './config/db.js';
import dotenv from 'dotenv'
import userRouter from './routes/user-routes.js';

dotenv.config();

const app= express();

app.use(express.json());

connectDB();

app.use("/api/user",userRouter);

app.use("/",(req,res,next)=>{
    res.send("Hello world")
});

const PORT=process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});