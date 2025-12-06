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

// ARTICLE ROUTES
router.post("/articles", requireAuth,postArticle);
router.get("/articles", requireAuth,getAllArticle);
router.get("/articles/search", requireAuth,searchArticle);
router.get("/articles/:id", requireAuth,getArticleById);
router.put("/articles/:id",requireAuth, updateArticleById);
router.delete("/articles/:id",requireAuth, deleteArticleById);

// COMMENT ROUTES
router.post("/articles/:id/comments",requireAuth, addComment);
router.put("/articles/:id/comments/:commentId",requireAuth, editComment);
router.delete("/articles/:id/comments/:commentId", requireAuth, deleteComment);
router.post("/articles/:id/comments/:commentId/like", requireAuth, likeComment);

// REPLY ROUTE
router.post("/articles/:id/comments/:commentId/replies", requireAuth, addReply);

module.exports = router;