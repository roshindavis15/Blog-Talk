import Blog from "../model/Blog.js";

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

    try {
        const blog = new Blog({
            title,
            description,
            image,
            user
        })
        await blog.save();
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



