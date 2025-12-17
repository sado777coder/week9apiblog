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
  addReply
} = require("../controllers/article.controller");

const router = express.Router();
router.use(requireAuth);

//ARTICLE ROUTES
router.post("/articles", postArticle);
router.get("/articles", requireAuth, getAllArticle);
router.get("/articles/search", searchArticle);
router.get("/articles/:id", getArticleById);
router.put("/articles/:id", updateArticleById);
router.delete("/articles/:id", deleteArticleById);

// COMMENT ROUTES
router.post("/articles/:id/comments", addComment);
router.put("/articles/:id/comments/:commentId", editComment);
router.delete("/articles/:id/comments/:commentId", deleteComment);
router.post("/articles/:id/comments/:commentId/like", likeComment);

// REPLY ROUTE
router.post("/articles/:id/comments/:commentId/replies", addReply);

module.exports = router;