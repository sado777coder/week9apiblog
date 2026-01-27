/**
 * @swagger
 * tags:
 *   name: Articles
 *   description: Article management API
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Reply:
 *       type: object
 *       required: [message]
 *       properties:
 *         _id:
 *           type: string
 *           example: 64fdc9b2a1c4e9a123456789
 *         user:
 *           type: string
 *           example: 64fdc8b2a1c4e9a123456788
 *         message:
 *           type: string
 *           example: Thanks for the clarification!
 *         likes:
 *           type: integer
 *           example: 0
 *         createdAt:
 *           type: string
 *           format: date-time
 *
 *     Comment:
 *       type: object
 *       required: [message]
 *       properties:
 *         _id:
 *           type: string
 *           example: 64fdc9b2a1c4e9a987654321
 *         user:
 *           type: string
 *           example: 64fdc8b2a1c4e9a123456788
 *         message:
 *           type: string
 *           example: Nice article!
 *         likes:
 *           type: integer
 *           example: 2
 *         replies:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Reply'
 *         createdAt:
 *           type: string
 *           format: date-time
 *
 *     Article:
 *       type: object
 *       required: [title, content]
 *       properties:
 *         _id:
 *           type: string
 *           example: 64fdc7a2a1c4e9a111222333
 *         title:
 *           type: string
 *           example: Introduction to BullMQ
 *         content:
 *           type: string
 *           example: BullMQ allows background job processing using Redis.
 *         subheading:
 *           type: string
 *           example: Background jobs made easy
 *         coverImage:
 *           type: string
 *           example: /uploads/article-image.png
 *         author:
 *           type: string
 *           example: 64fdc8b2a1c4e9a123456788
 *         comments:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Comment'
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/articles:
 *   post:
 *     summary: Create a new article
 *     tags: [Articles]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Article'
 *     responses:
 *       201:
 *         description: Article created
 *
 *   get:
 *     summary: Get all articles
 *     tags: [Articles]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of articles
 */

/**
 * @swagger
 * /api/articles/search:
 *   get:
 *     summary: Search articles
 *     tags: [Articles]
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Search results
 */

/**
 * @swagger
 * /api/articles/{id}:
 *   get:
 *     summary: Get article by ID
 *     tags: [Articles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Article found
 *
 *   put:
 *     summary: Update article
 *     tags: [Articles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Article'
 *     responses:
 *       200:
 *         description: Article updated
 *
 *   delete:
 *     summary: Delete article
 *     tags: [Articles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Article deleted
 */

/**
 * @swagger
 * /api/articles/{id}/comments:
 *   post:
 *     summary: Add a comment to an article
 *     tags: [Articles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Comment'
 *     responses:
 *       201:
 *         description: Comment added
 */

/**
 * @swagger
 * /api/articles/{id}/comments/{commentId}:
 *   put:
 *     summary: Edit a comment
 *     tags: [Articles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *       - in: path
 *         name: commentId
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Comment'
 *     responses:
 *       200:
 *         description: Comment updated
 *
 *   delete:
 *     summary: Delete a comment
 *     tags: [Articles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *       - in: path
 *         name: commentId
 *         required: true
 *     responses:
 *       200:
 *         description: Comment deleted
 */

/**
 * @swagger
 * /api/articles/{id}/comments/{commentId}/like:
 *   post:
 *     summary: Like a comment
 *     tags: [Articles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *       - in: path
 *         name: commentId
 *         required: true
 *     responses:
 *       200:
 *         description: Comment liked
 */

/**
 * @swagger
 * /api/articles/{id}/comments/{commentId}/replies:
 *   post:
 *     summary: Add a reply to a comment
 *     tags: [Articles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *       - in: path
 *         name: commentId
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Reply'
 *     responses:
 *       201:
 *         description: Reply added
 */

/**
 * @swagger
 * /api/articles/{id}/comments/{commentId}/replies/{replyId}:
 *   put:
 *     summary: Edit a reply
 *     tags: [Articles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *       - in: path
 *         name: commentId
 *         required: true
 *       - in: path
 *         name: replyId
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Reply'
 *     responses:
 *       200:
 *         description: Reply updated
 *
 *   delete:
 *     summary: Delete a reply
 *     tags: [Articles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *       - in: path
 *         name: commentId
 *         required: true
 *       - in: path
 *         name: replyId
 *         required: true
 *     responses:
 *       200:
 *         description: Reply deleted
 */