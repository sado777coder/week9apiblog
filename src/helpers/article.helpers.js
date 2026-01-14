const ArticleModel = require("../models/article.model");

// Find article by ID
const findArticleOrThrow = async (articleId) => {
  const article = await ArticleModel.findById(articleId);
  if (!article) {
    const err = new Error("Article not found");
    err.status = 404;
    throw err;
  }
  return article;
};

// Find comment
const findCommentOrThrow = (article, commentId) => {
  const comment = article.comments.id(commentId);
  if (!comment) {
    const err = new Error("Comment not found");
    err.status = 404;
    throw err;
  }
  return comment;
};

// Find reply
const findReplyOrThrow = (comment, replyId) => {
  const reply = comment.replies.id(replyId);
  if (!reply) {
    const err = new Error("Reply not found");
    err.status = 404;
    throw err;
  }
  return reply;
};

// Ownership check
const checkOwnership = (resourceUserId, loggedInUserId, message) => {
  if (resourceUserId.toString() !== loggedInUserId.toString()) {
    const err = new Error(message);
    err.status = 403;
    throw err;
  }
};

module.exports = {
  findArticleOrThrow,
  findCommentOrThrow,
  findReplyOrThrow,
  checkOwnership,
};