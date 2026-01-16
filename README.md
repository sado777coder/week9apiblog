Week 9 Blog API

A fully-featured RESTful Blog API built with Node.js, Express, MongoDB, JWT authentication, Redis caching, and documented using Swagger.
This API supports user authentication, article management, comments, replies, likes, search, and caching for performance.

 Features
 Authentication & Authorization

User registration and login

JWT-based authentication

Secure protected routes

Logout with Redis token blacklisting

Authorization checks (users can only edit/delete their own content)

Articles

Create, read, update, delete (CRUD) articles

Pagination for articles list

Redis caching for:

All articles

Single article

Cache invalidation on create/update/delete

Search articles by keyword

💬 Comments & Replies

Add comments to articles

Edit & delete comments (owner only)

Like comments

Add replies to comments

Edit & delete replies (owner only)

Nested comments & replies structure

User identity derived securely from JWT (no username in payload)

 Performance & Reliability

Redis caching for faster reads

Graceful Redis failure handling (server does not crash)

Clean validation using Joi

Centralized error handling

 Tech Stack

Backend: Node.js, Express.js

Database: MongoDB (Mongoose)

Authentication: JWT

Caching: Redis (ioredis)

Validation: Joi

Documentation: Swagger (OpenAPI)

Testing: Postman

Deployment: Render

 Project Structure
week9BlogApi/
├── controllers/
│   ├── article.controller.js
│   └── user.controller.js
├── models/
│   ├── article.model.js
│   └── user.model.js
├── routes/
│   ├── article.routes.js
│   └── user.routes.js
├── middleware/
│   └── auth.middleware.js
├── validators/
│   └── post.validation.js
├── utility/
│   ├── article.redis.js
│   └── bcrypt.js
├── config/
│   └── redis.js
├── helpers/
│   └── article.helpers.js
├── app.js
├── server.js
└── README.md

 Authentication Flow

Register or login

Receive JWT token

Pass token in headers:

Authorization: Bearer <your_token>


Token is verified on protected routes

Logout blacklists token using Redis

 API Documentation
🔹 Swagger (Live)

Use Swagger to explore and test endpoints:

Swagger JSON

https://week9apiblog-1.onrender.com/api-docs-json

 Postman Collection

All endpoints have been tested and documented in Postman.

 Postman Workspace

https://sado777coder-4419533.postman.co/workspace/Amos-Sottie's-Workspace~bfa808a6-e923-4217-869b-5243d41693eb/folder/49418763-8aa70ae2-22a7-4450-9ba3-ac54f0f23101?action=share&source=copy-link&creator=49418763&ctx=documentation


Test users have already been created and verified.

 Search Articles

Search articles using keywords in title, content, or subheading:

GET /api/articles/search?q=backend


MongoDB text index is used for efficient searching.

 Example Endpoints
Register
POST /api/user/sign-up

Login
POST /api/user/login

Create Article
POST /api/articles

Get All Articles (Cached)
GET /api/articles?page=1&limit=10

Get Single Article (Cached)
GET /api/articles/:id

Add Comment
POST /api/articles/:id/comments

Edit Comment
PUT /api/articles/:id/comments/:commentId

Add Reply
POST /api/articles/:id/comments/:commentId/replies

Like Comment
POST /api/articles/:id/comments/:commentId/like

 Environment Variables

Create a .env file:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
REDIS_URL=your_redis_url

Run Locally
npm install
npm run dev


Server will start on:

http://localhost:5000

 Status

 Authentication working

Comments & replies fixed

Redis caching stable

 Search enabled

 Postman & Swagger documented

 Deployed and tested

 Author

Amos Ofori Sottie
Backend Developer
GitHub: https://github.com/sado777coder
