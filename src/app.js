const express = require("express");
const cors = require("cors");
const requestLoger = require("./middlewares/loger.js");
const errorHandler = require("./middlewares/errorHandler.js");
const ArticleRoutes = require("./routes/article.route.js");
const userRoute = require("./routes/user.route.js");
const { swaggerUi, swaggerSpec } = require("./swagger/swagger");
const rateLimiter = require("./middlewares/rateLimiter");



const app = express();

app.use(express.json());
app.use(rateLimiter);
app.use(cors("*"));

app.use(requestLoger);

app.use("/api",ArticleRoutes);
app.use("/api/user", userRoute)
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

//  API DOCS JSON
app.get("/api-docs-json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

app.use(errorHandler);

// export app
module.exports = app;
