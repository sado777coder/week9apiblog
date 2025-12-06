const Joi = require("joi");
const ArticleModel = require("../models/article.model");
const userModel = require("../models/user.model");

// CREATE ARTICLE
const postArticle = async (req, res, next) => {
    const articleSchema = Joi.object({
        title: Joi.string().min(5).required(),
        content: Joi.string().min(20).required(),
        author: Joi.string().optional().default("Guest"),
        subheading: Joi.string().optional(),
    });

    const { error, value } = articleSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.message });
    };

    try {
        const newArticle = new ArticleModel({
            title : req.body.title,
            content : req.body.content,
            author : req.user.userId,
        });
         await ArticleModel.create(value);
        return res.status(201).json({
            message: "Article created",
            data: newArticle,
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
};

// GET ALL ARTICLES
const getAllArticle = async (req, res, next) => {
    const { limit = 10, page = 1 } = req.query;
    const skip = (page - 1) * limit;

    try {
        const articles = await ArticleModel.find({}).populate("author", "name _id email")
            .sort({ createdAt: -1 })
            .limit(Number(limit))
            .skip(Number(skip));

        return res.status(200).json({
            message: "Articles fetched",
            data: articles,
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
};

// GET SINGLE ARTICLE
const getArticleById = async (req, res, next) => {
    try {
        const article = await ArticleModel.findById(req.params.id);

        if (!article) {
            return res.status(404).json({
                message: `Article with ID ${req.params.id} not found`,
            });
        }

        return res.status(200).json({
            message: "Article found",
            data: article,
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
};

// UPDATE ARTICLE
const updateArticleById = async (req, res, next) => {
    const { error, value } = Joi.object({
        title: Joi.string().min(5).optional(),
        content: Joi.string().min(20).optional(),
        subheading: Joi.string().optional(),
    }).validate(req.body);

    if (error) return res.status(400).json({ message: error.message });

    try {
        const article = await ArticleModel.findById(req.params.id);

        if (!article) {
            return res.status(404).json({ message: "Article not found" });
        }

        // USER NOT OWNER — BLOCK EDIT
        if (article.author.toString() !== req.user.userId) {
            return res.status(403).json({
                message: "Unauthorized. You can only edit your own article."
            });
        }

        const updated = await ArticleModel.findByIdAndUpdate(
            req.params.id,
            value,
            { new: true, runValidators: true }
        );

        return res.status(200).json({
            message: "Article updated",
            data: updated,
        });

    } catch (err) {
        next(err);
    }
};

// DELETE ARTICLE
const deleteArticleById = async (req, res, next) => {
    try {
        const article = await ArticleModel.findById(req.params.id);

        if (!article) {
            return res.status(404).json({ message: "Article not found" });
        }

        // USER NOT OWNER — BLOCK DELETE
        if (article.author.toString() !== req.user.userId) {
            return res.status(403).json({
                message: "Unauthorized. You can only delete your own article."
            });
        }

        await article.deleteOne();

        return res.status(200).json({ message: "Article deleted" });

    } catch (err) {
        next(err);
    }
};

// SEARCH ARTICLES
const searchArticle = async (req, res, next) => {
    try {
        const keyword = req.query.q;

        if (!keyword) {
            return res.status(400).json({
                message: "Search query ?q=keyword is required",
            });
        }

        const results = await ArticleModel.find({
            $text: { $search: keyword },
        });

        return res.status(200).json({
            message: "Search results",
            data: results,
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
};

// ADD COMMENT
const addComment = async (req, res, next) => {
    const { username, message } = req.body;

    if (!username || !message) {
        return res.status(400).json({ message: "username and message are required" });
    }

    try {
        const article = await ArticleModel.findById(req.params.id);
        if (!article) return res.status(404).json({ message: "Article not found" });

        article.comments.push({ username, message });
        await article.save();

        res.status(201).json({ message: "Comment added", data: article });
    } catch (err) {
        next(err);
    }
};

// EDIT COMMENT
const editComment = async (req, res, next) => {
    const { message } = req.body;

    if (!message) return res.status(400).json({ message: "Message is required" });

    try {
        const article = await ArticleModel.findById(req.params.id);
        if (!article) return res.status(404).json({ message: "Article not found" });

        const comment = article.comments.id(req.params.commentId);
        if (!comment) return res.status(404).json({ message: "Comment not found" });

        comment.message = message;
        await article.save();

        res.status(200).json({ message: "Comment updated", data: article });
    } catch (err) {
        next(err);
    }
};

// DELETE COMMENT
const deleteComment = async (req, res, next) => {
    try {
        const article = await ArticleModel.findById(req.params.id);
        if (!article) return res.status(404).json({ message: "Article not found" });

        const comment = article.comments.id(req.params.commentId);
        if (!comment) return res.status(404).json({ message: "Comment not found" });

        comment.deleteOne();
        await article.save();

        res.status(200).json({ message: "Comment deleted" });
    } catch (err) {
        next(err);
    }
};

// LIKE COMMENT
const likeComment = async (req, res, next) => {
    try {
        const article = await ArticleModel.findById(req.params.id);
        if (!article) return res.status(404).json({ message: "Article not found" });

        const comment = article.comments.id(req.params.commentId);
        if (!comment) return res.status(404).json({ message: "Comment not found" });

        comment.likes += 1;
        await article.save();

        res.status(200).json({ message: "Comment liked", likes: comment.likes });
    } catch (err) {
        next(err);
    }
};

// ADD REPLY
const addReply = async (req, res, next) => {
    const { username, message } = req.body;

    if (!username || !message) {
        return res.status(400).json({ message: "username and message are required" });
    }

    try {
        const article = await ArticleModel.findById(req.params.id);
        if (!article) return res.status(404).json({ message: "Article not found" });

        const comment = article.comments.id(req.params.commentId);
        if (!comment) return res.status(404).json({ message: "Comment not found" });

        comment.replies.push({ username, message });
        await article.save();

        res.status(201).json({ message: "Reply added", data: article });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    postArticle,
    getAllArticle,
    getArticleById,
    updateArticleById,
    deleteArticleById,
    searchArticle,
    addComment,
    editComment,
    deleteComment,
    likeComment,
    addReply,
};