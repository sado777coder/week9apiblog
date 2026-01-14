const ArticleModel = require("../models/article.model");

// Find article by ID
const findArticleOrThrow = async (articleId) => {
  const article = await ArticleModel.findById(articleId);
  if (!article) {
    throw { status: 404, message: "Article not found" };
  }
  return article;
};

// Find comment
const findCommentOrThrow = (article, commentId) => {
  const comment = article.comments.id(commentId);
  if (!comment) {
    throw { status: 404, message: "Comment not found" };
  }
  return comment;
};

// Find reply
const findReplyOrThrow = (comment, replyId) => {
  const reply = comment.replies.id(replyId);
  if (!reply) {
    throw { status: 404, message: "Reply not found" };
  }
  return reply;
};

// Ownership check
const checkOwnership = (resourceUserId, loggedInUserId, message) => {
  if (resourceUserId.toString() !== loggedInUserId.toString()) {
    throw { status: 403, message };
  }
};

module.exports = {
  findArticleOrThrow,
  findCommentOrThrow,
  findReplyOrThrow,
  checkOwnership,
};