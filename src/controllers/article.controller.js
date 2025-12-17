const ArticleModel = require("../models/article.model");
const redisClient = require("../config/redis");
const {
  createArticleSchema,
  updateArticleSchema,
  commentSchema,
  editCommentSchema,
} = require("../validators/post.validation");

// REDIS HELPERS
const clearArticlesCache = async () => {
  const keys = await redisClient.keys("articles:*");
  if (keys.length > 0) {
    await redisClient.del(keys);
  }
};

// CREATE ARTICLE
const postArticle = async (req, res, next) => {
  const { error, value } = createArticleSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    const newArticle = await ArticleModel.create({
      ...value,
      author: req.user._id,
    });

    await clearArticlesCache();

    return res.status(201).json({
      message: "Article created",
      data: newArticle,
    });
  } catch (err) {
    next(err);
  }
};

// GET ALL ARTICLES (CACHED)
const getAllArticle = async (req, res, next) => {
  const { limit = 10, page = 1 } = req.query;
  const skip = (page - 1) * limit;
  const cacheKey = `articles:page=${page}:limit=${limit}`;

  try {
    const cachedArticles = await redisClient.get(cacheKey);
    if (cachedArticles) {
      return res.status(200).json({
        message: "Articles fetched (cache)",
        data: JSON.parse(cachedArticles),
      });
    }

    const articles = await ArticleModel.find({})
      .populate("author", "name _id email")
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip(Number(skip));

    await redisClient.setEx(cacheKey, 60, JSON.stringify(articles));

    return res.status(200).json({
      message: "Articles fetched (database)",
      data: articles,
    });
  } catch (err) {
    next(err);
  }
};

// GET SINGLE ARTICLE (CACHED)
const getArticleById = async (req, res, next) => {
  const cacheKey = `article:${req.params.id}`;

  try {
    const cachedArticle = await redisClient.get(cacheKey);
    if (cachedArticle) {
      return res.status(200).json({
        message: "Article found (cache)",
        data: JSON.parse(cachedArticle),
      });
    }

    const article = await ArticleModel.findById(req.params.id);
    if (!article) {
      return res.status(404).json({
        message: `Article with ID ${req.params.id} not found`,
      });
    }

    await redisClient.setEx(cacheKey, 60, JSON.stringify(article));

    return res.status(200).json({
      message: "Article found (database)",
      data: article,
    });
  } catch (err) {
    next(err);
  }
};

// UPDATE ARTICLE
const updateArticleById = async (req, res, next) => {
  const { error, value } = updateArticleSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    const article = await ArticleModel.findById(req.params.id);
    if (!article) return res.status(404).json({ message: "Article not found" });

    if (article.author.toString() !== req.user.userId) {
      return res.status(403).json({
        message: "Unauthorized. You can only edit your own article.",
      });
    }

    const updated = await ArticleModel.findByIdAndUpdate(
      req.params.id,
      value,
      { new: true, runValidators: true }
    );

    await redisClient.del(`article:${req.params.id}`);
    await clearArticlesCache();

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
    if (!article) return res.status(404).json({ message: "Article not found" });

    if (article.author.toString() !== req.user.userId) {
      return res.status(403).json({
        message: "Unauthorized. You can only delete your own article.",
      });
    }

    await article.deleteOne();

    await redisClient.del(`article:${req.params.id}`);
    await clearArticlesCache();

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
  } catch (err) {
    next(err);
  }
};

// ADD COMMENT
const addComment = async (req, res, next) => {
  const { error, value } = commentSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    const article = await ArticleModel.findById(req.params.id);
    if (!article) return res.status(404).json({ message: "Article not found" });

    article.comments.push(value);
    await article.save();

    await redisClient.del(`article:${req.params.id}`);

    res.status(201).json({ message: "Comment added", data: article });
  } catch (err) {
    next(err);
  }
};

// EDIT COMMENT
const editComment = async (req, res, next) => {
  const { error, value } = editCommentSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    const article = await ArticleModel.findById(req.params.id);
    if (!article) return res.status(404).json({ message: "Article not found" });

    const comment = article.comments.id(req.params.commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    comment.message = value.message;
    await article.save();

    await redisClient.del(`article:${req.params.id}`);

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

    await redisClient.del(`article:${req.params.id}`);

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

    await redisClient.del(`article:${req.params.id}`);

    res
      .status(200)
      .json({ message: "Comment liked", likes: comment.likes });
  } catch (err) {
    next(err);
  }
};

// ADD REPLY
const addReply = async (req, res, next) => {
  const { error, value } = commentSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    const article = await ArticleModel.findById(req.params.id);
    if (!article) return res.status(404).json({ message: "Article not found" });

    const comment = article.comments.id(req.params.commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    comment.replies.push(value);
    await article.save();

    await redisClient.del(`article:${req.params.id}`);

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