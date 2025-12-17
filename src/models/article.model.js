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
    replies: [replySchema]
});

const articleSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },

    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",       // <== must be inside the field object
        required: true
    },

    subheading: String,
    comments: [commentSchema]
}, { timestamps: true });

module.exports = mongoose.model("article", articleSchema);