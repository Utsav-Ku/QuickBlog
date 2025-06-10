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
}