const ArticleModel = require("../models/article.model");
const {
  createArticleSchema,
  updateArticleSchema,
  commentSchema,
  editCommentSchema,
} = require("../validators/post.validation");

const {
  clearArticlesCache,
  getArticlesCache,
  setArticlesCache,
  getArticleCache,
  setArticleCache,
  deleteArticleCache,
} = require("../utility/article.redis");

const {
  findArticleOrThrow,
  findCommentOrThrow,
  findReplyOrThrow,
  checkOwnership,
} = require("../helpers/article.helpers");

const { addNotificationJob } = require("../queues/notification.queue");

/* =========================
   CREATE ARTICLE
========================= */
const postArticle = async (req, res, next) => {
  const { error, value } = createArticleSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    const newArticle = await ArticleModel.create({
      ...value,
      author: req.user._id,
      coverImage: req.file ? `/uploads/${req.file.filename}` : null,
    });

    await clearArticlesCache();

    res.status(201).json({
      message: "Article created",
      data: newArticle,
    });
  } catch (err) {
    next(err);
  }
};

/* =========================
   GET ALL ARTICLES (CACHED)
========================= */
const getAllArticle = async (req, res, next) => {
  const { limit = 10, page = 1 } = req.query;
  const skip = (page - 1) * limit;
  const cacheKey = `articles:page=${page}:limit=${limit}`;

  try {
    const cached = await getArticlesCache(cacheKey);
    if (cached) {
      return res.status(200).json({
        message: "Articles fetched (cache)",
        data: cached,
      });
    }

    const articles = await ArticleModel.find({})
      .populate("author", "name email")
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip(Number(skip));

    await setArticlesCache(cacheKey, articles);

    res.status(200).json({
      message: "Articles fetched (database)",
      data: articles,
    });
  } catch (err) {
    next(err);
  }
};

/* =========================
   GET SINGLE ARTICLE (CACHED)
========================= */
const getArticleById = async (req, res, next) => {
  try {
    const cached = await getArticleCache(req.params.id);
    if (cached) {
      return res.status(200).json({
        message: "Article found (cache)",
        data: cached,
      });
    }

    const article = await ArticleModel.findById(req.params.id);
    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }

    await setArticleCache(req.params.id, article);

    res.status(200).json({
      message: "Article found (database)",
      data: article,
    });
  } catch (err) {
    next(err);
  }
};

/* =========================
   UPDATE ARTICLE
========================= */
const updateArticleById = async (req, res, next) => {
  const { error, value } = updateArticleSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    const article = await ArticleModel.findById(req.params.id);
    if (!article) return res.status(404).json({ message: "Article not found" });

    checkOwnership(
      article.author,
      req.user._id,
      "You can only edit your own article"
    );

    const updated = await ArticleModel.findByIdAndUpdate(
      req.params.id,
      value,
      { new: true, runValidators: true }
    );

    await deleteArticleCache(req.params.id);
    await clearArticlesCache();

    res.status(200).json({
      message: "Article updated",
      data: updated,
    });
  } catch (err) {
    next(err);
  }
};

/* =========================
   DELETE ARTICLE
========================= */
const deleteArticleById = async (req, res, next) => {
  try {
    const article = await ArticleModel.findById(req.params.id);
    if (!article) return res.status(404).json({ message: "Article not found" });

    checkOwnership(
      article.author,
      req.user._id,
      "You can only delete your own article"
    );

    await article.deleteOne();
    await deleteArticleCache(req.params.id);
    await clearArticlesCache();

    res.status(200).json({ message: "Article deleted" });
  } catch (err) {
    next(err);
  }
};

/* =========================
   SEARCH ARTICLES
========================= */
const searchArticle = async (req, res, next) => {
  try {
    if (!req.query.q) {
      return res.status(400).json({
        message: "Search query ?q=keyword is required",
      });
    }

    const results = await ArticleModel.find({
      $text: { $search: req.query.q },
    });

    res.status(200).json({
      message: "Search results",
      data: results,
    });
  } catch (err) {
    next(err);
  }
};

/* =========================
   ADD COMMENT + NOTIFICATION
========================= */
const addComment = async (req, res, next) => {
  const { error, value } = commentSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    const article = await findArticleOrThrow(req.params.id);

    article.comments.push({
      message: value.message,
      user: req.user._id,
    });

    await article.save();
    await deleteArticleCache(req.params.id);

    if (article.author.toString() !== req.user._id.toString()) {
      await addNotificationJob({
        userId: article.author,
        type: "COMMENT_ADDED",
        articleId: article._id,
        commentBy: req.user._id,
        message: "New comment on your article",
      });
    }

    res.status(201).json({
      message: "Comment added",
      data: article,
    });
  } catch (err) {
    next(err);
  }
};

/* =========================
   EDIT COMMENT
========================= */
const editComment = async (req, res, next) => {
  const { error, value } = editCommentSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    const article = await findArticleOrThrow(req.params.id);
    const comment = findCommentOrThrow(article, req.params.commentId);

    checkOwnership(
      comment.user,
      req.user._id,
      "You can only edit your own comment"
    );

    comment.message = value.message;
    await article.save();
    await deleteArticleCache(req.params.id);

    res.status(200).json({ message: "Comment updated", data: article });
  } catch (err) {
    next(err);
  }
};

/* =========================
   DELETE COMMENT
========================= */
const deleteComment = async (req, res, next) => {
  try {
    const article = await findArticleOrThrow(req.params.id);
    const comment = findCommentOrThrow(article, req.params.commentId);

    checkOwnership(
      comment.user,
      req.user._id,
      "You can only delete your own comment"
    );

    comment.deleteOne();
    await article.save();
    await deleteArticleCache(req.params.id);

    res.status(200).json({ message: "Comment deleted" });
  } catch (err) {
    next(err);
  }
};

/* =========================
   LIKE COMMENT + NOTIFICATION
========================= */
const likeComment = async (req, res, next) => {
  try {
    const article = await findArticleOrThrow(req.params.id);
    const comment = findCommentOrThrow(article, req.params.commentId);

    comment.likes += 1;
    await article.save();
    await deleteArticleCache(req.params.id);

    await addNotificationJob({
      userId: article.author,
      type: "COMMENT_LIKED",
      articleId: article._id,
      commentBy: req.user._id,
      message: "Someone liked your comment",
    });

    res.status(200).json({
      message: "Comment liked",
      likes: comment.likes,
    });
  } catch (err) {
    next(err);
  }
};

/* =========================
   ADD REPLY + NOTIFICATION
========================= */
const addReply = async (req, res, next) => {
  const { error, value } = commentSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    const article = await findArticleOrThrow(req.params.id);
    const comment = findCommentOrThrow(article, req.params.commentId);

    comment.replies.push({
      message: value.message,
      user: req.user._id,
    });

    await article.save();
    await deleteArticleCache(req.params.id);

    await addNotificationJob({
      userId: article.author,
      type: "REPLY_ADDED",
      articleId: article._id,
      commentBy: req.user._id,
      message: "New reply on your comment",
    });

    res.status(201).json({ message: "Reply added", data: article });
  } catch (err) {
    next(err);
  }
};

/* =========================
   EDIT REPLY
========================= */
const editReply = async (req, res, next) => {
  const { error, value } = editCommentSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    const article = await findArticleOrThrow(req.params.id);
    const comment = findCommentOrThrow(article, req.params.commentId);
    const reply = findReplyOrThrow(comment, req.params.replyId);

    checkOwnership(
      reply.user,
      req.user._id,
      "You can only edit your own reply"
    );

    reply.message = value.message;
    await article.save();
    await deleteArticleCache(req.params.id);

    res.status(200).json({ message: "Reply updated", data: article });
  } catch (err) {
    next(err);
  }
};

/* =========================
   DELETE REPLY
========================= */
const deleteReply = async (req, res, next) => {
  try {
    const article = await findArticleOrThrow(req.params.id);
    const comment = findCommentOrThrow(article, req.params.commentId);
    const reply = findReplyOrThrow(comment, req.params.replyId);

    checkOwnership(
      reply.user,
      req.user._id,
      "You can only delete your own reply"
    );

    reply.deleteOne();
    await article.save();
    await deleteArticleCache(req.params.id);

    res.status(200).json({ message: "Reply deleted" });
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
  editReply,
  deleteReply,
};