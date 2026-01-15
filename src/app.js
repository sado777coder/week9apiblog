const express = require("express");
const cors = require("cors");
const requestLoger = require("./middlewares/loger.js");
const errorHandler = require("./middlewares/errorHandler.js");
const ArticleRoutes = require("./routes/article.route.js");
const userRoute = require("./routes/user.route.js");
const { swaggerUi, swaggerSpec } = require("./docs/swagger");
const rateLimiter = require("./middlewares/rateLimiter");

const app = express();

app.use(express.json());
//app.use(rateLimiter);
app.use(cors("*"));
app.use(requestLoger);

// Routes
app.use("/api", ArticleRoutes);
app.use("/api/user", userRoute);

// Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Swagger JSON
app.get("/api-docs-json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

app.use(errorHandler);

module.exports = app;