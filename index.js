require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./database/connectDB.js");
const requestLoger = require("./middlewares/loger.js");
const errorHandler = require("./middlewares/errorHandler.js");
const ArticleRoutes = require("./routes/article.route.js");
const userRoute = require("./routes/user.route.js");
const { swaggerUi, swaggerSpec } = require("./swagger/swagger");



const app = express();
const PORT = process.env.PORT;
connectDB();

app.use(express.json());
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
app.listen(PORT, () => {
    console.log(`sever is listening on port ${PORT}`);
});