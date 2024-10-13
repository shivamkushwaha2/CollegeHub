const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    content: { type: String, required: true },
    imageUrl: { type: String }, // Optional image
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Reference to the User model
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Users who liked the post
}, { timestamps: true });

const Post = mongoose.model("Post", postSchema);
module.exports = Post;
