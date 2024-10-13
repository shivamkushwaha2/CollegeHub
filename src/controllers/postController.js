const Post = require("../models/postModel");
const upload = require('../middlewares/multerConfig'); // Import multer config


const cloudinary = require("../cloudinary");

// Create a post
const createPost = async (req, res) => {
    const { content } = req.body; // Extract content from request body
    let imageUrl = '';

    try {
        if (!content) {
            return res.status(400).json({ message: "Content is required" });
        }

        // Check if an image file was uploaded
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path);
            imageUrl = result.secure_url; // Use the secure URL for the uploaded image
        }

        // Create the new post in the database
        const newPost = await Post.create({
            content,
            imageUrl,
            user: req.userId // Get the userId from the auth middleware
        });

        res.status(201).json(newPost);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong" });
    }
};



// Get all posts
const getPosts = async (req, res) => {
    try {
        const posts = await Post.find().populate("user", "name email").sort({ createdAt: -1 }); // Fetch posts and sort by recent
        res.status(200).json(posts);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong" });
    }
};

// Like a post
const likePost = async (req, res) => {
    const { postId } = req.params;
    
    try {
        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        // Check if user already liked the post
        const liked = post.likes.includes(req.userId);
        if (liked) {
            post.likes = post.likes.filter((id) => id.toString() !== req.userId); // Unlike
        } else {
            post.likes.push(req.userId); // Like the post
        }

        await post.save();
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" });
        console.log(error);
    }
};

module.exports = { createPost, getPosts, likePost };
