import express from 'express';
import {getAllBlogs,addBlog,updateBlog,getById,deleteBlog,getByUserId} from "../controllers/blog-controller.js";
import { authenticateToken } from '../middleware/auth.js';

const blogRouter=express.Router();

blogRouter.get("/",getAllBlogs);
blogRouter.post("/addBlog",authenticateToken,addBlog);
blogRouter.put("/update/:id",authenticateToken,updateBlog);
blogRouter.get("/:id",authenticateToken,getById);
blogRouter.delete("/:id",authenticateToken,deleteBlog);
blogRouter.get('/user/:id',authenticateToken,getByUserId)


export default blogRouter;