import Blog from "../model/Blog.js";
import User from "../model/User.js";
import mongoose from "mongoose"

export const getAllBlogs = async (req, res) => {
    let blogs;
    try {

        blogs = await Blog.find();
        console.log(blogs);

        if (!blogs) {
            return res.status(404).json({ message: "No Blogs Found" })
        }
        return res.status(200).json({ blogs });
    } catch (error) {
        console.error(error.message);
    }
}

export const addBlog = async (req, res) => {
    const { title, description, image, user } = req.body;
    console.log(req.body);
    try {
        const existingUser=await User.findById(user);

        if(!existingUser){
            return res.status(400).json({message:"unable to find  the user by this id"});
        }
        const blog = new Blog({
            title,
            description,
            image,
            user
        })
        const session=await mongoose.startSession();
        session.startTransaction();
        await blog.save({session});
        existingUser.blogs.push(blog);
        await existingUser.save({session})
        await session.commitTransaction();
       console.log("reached herrrrrrrrrr");
        return res.status(200).json({ blog });
    } catch (error) {
        console.error(error.message);
    }

}

export const updateBlog = async (req, res) => {

    const blogId = req.params.id;

    const { title, description } = req.body;

    try {
        const blog = await Blog.findByIdAndUpdate(blogId, {
            title,
            description
        })
        if (!blog) {
            return res.status(500).json("unable to update");
        }
        return res.status(200).json({ blog });
    } catch (error) {
        console.error(error.message);
    }
}

export const getById=async(req,res)=>{
    const blogId=req.params.id;
    console.log("blogId:",blogId)
    try {
        const blog=await Blog.findById(blogId);
         if(blog){
            return res.json({blog});
         }
    } catch (error) {
        console.error(error.message);
    }

};

export const deleteBlog=async(req,res)=>{
    console.log("reached");

    const blogId=req.params.id;
    console.log("blogId:",blogId);
    try {
        const blog=await Blog.findById(blogId).populate('user');
        if(!blog){
            return res.status(404).json({message:"Blog not found"})
        }
        await blog.user.blogs.pull(blog._id);
        await blog.user.save();
        await Blog.findByIdAndDelete(blogId);
        return res.status(200).json({message:"Successfully deleted"});
    } catch (error) {
        console.error(error.message);
    }
}

export const getByUserId=async(req,res)=>{
      const userId=req.params.id;
      try {
        const userBlogs=await User.findById(userId).populate("blogs");
        if(!userBlogs){
            return res.status(404).json({message:"no blogs for this user"})
        }
        res.status(200).json({blogs:userBlogs});    

      } catch (error) {
        
      }
}



