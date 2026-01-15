const express = require("express");
const requireAuth = require("../middlewares/requireAuth");

const {
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
} = require("../controllers/article.controller");

const router = express.Router();
// Public routes
router.get("/articles", getAllArticle);
router.get("/articles/search", searchArticle);
router.get("/articles/:id", getArticleById);

// Protected routes
router.post("/articles", requireAuth, postArticle);
router.put("/articles/:id", requireAuth, updateArticleById);
router.delete("/articles/:id", requireAuth, deleteArticleById);

router.post("/articles/:id/comments", requireAuth, addComment);
router.put("/articles/:id/comments/:commentId", requireAuth, editComment);
router.delete("/articles/:id/comments/:commentId", requireAuth, deleteComment);
router.post("/articles/:id/comments/:commentId/like", requireAuth, likeComment);

router.post("/articles/:id/comments/:commentId/replies", requireAuth, addReply);
router.put("/articles/:id/comments/:commentId/replies/:replyId", requireAuth, editReply);
router.delete("/articles/:id/comments/:commentId/replies/:replyId", requireAuth, deleteReply);

module.exports = router;