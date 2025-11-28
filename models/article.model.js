const mongoose = require("mongoose");

const replySchema = new mongoose.Schema({
    username: { type: String, required: true },
    message: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    likes: { type: Number, default: 0 }
});

const commentSchema = new mongoose.Schema({
    username: { type: String, required: true },
    message: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    likes: { type: Number, default: 0 },
    replies: [replySchema]   // <— Embedded replies
});

const articleSchema = new mongoose.Schema({
    title: String,
    content: String,
    author: String,
    subheading: String,
    comments: [commentSchema]
}, { timestamps: true });

module.exports = mongoose.model("Article", articleSchema);