const express = require("express");
const router = express.Router();

const requireAuth = require("../middlewares/requireAuth");
const { getMyNotifications } = require("../controllers/notification.controller");

// GET /api/notifications
router.get("/", requireAuth, getMyNotifications);

module.exports = router;