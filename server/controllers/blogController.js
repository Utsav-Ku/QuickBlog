import fs from 'fs';
import imagekit from '../configs/imageKit.js';
import Blog from '../models/Blog.js';

export const addBlog = async (req, res) => {
    try {
        const { title, subTitle, description, category, isPublished } = JSON.parse(req.body.blog);
        const imageFile = req.file;

        //check if all required fields are present
        if(!title || !description || !category || !imageFile) {
            return res.json({ success: false, message: "All fields are required" });
        }

        const fileBuffer = fs.readFileSync(imageFile.path);

        //upload image to ImageKit
        const response = await imagekit.upload({
            file: fileBuffer, //required
            fileName: imageFile.originalname, //required
            folder: "/blogs" //optional
        })

        //optimization through imageKit URL transformation
        const optimizedImageUrl = imagekit.url({
            path: response.filePath,
            transformation: [
                {quality: 'auto'}, //auto compression
                {format: 'webp'}, //convert to webp(modern) format
                {widht: '1280'} //resize to 1280px width
            ]
        });

        const image = optimizedImageUrl;

        await Blog.create({title, subTitle, description, category, image, isPublished});

        res.json({ success: true, message: "Blog added successfully" });

    } catch (error) {
        res.json({success: false, message: error.message});
    }
};

export const getAllBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find({ isPublished: true})
        res.json({ success: true, blogs });
    } catch (error) {
        res.json({success: false, message: error.message});
    }
};

export const getBlogById = async (req, res) => {
    try {
        const { blogId } = req.params;
        const blog = await Blog.findById(blogId);

        if(!blog) {
            res.json({ success: false, message: "Blog not found"});
        }
        res.json({success: true, blog});

    } catch (error) {
        res.json({success: false, message: error.message});
    }
};

export const deleteBlogById = async (req, res) => {
    try {
        const { id } = req.body;
        await Blog.findByIdAndDelete(id);
        res.json({ success: true, message: "Blog deleted successfully" });

    } catch (error) {
        res.json({success: false, message: error.message});
    }
};

export const togglePublish = async (req, res) => {
    try {

        const { id } = req.body;
        const blog = await Blog.findById(id);
        blog.isPublished = !blog.isPublished;
        await blog.save();
        res.json({ success: true, message: "Blog status updated" });

    } catch (error) {
        res.json({success: false, message: error.message});
    }
};