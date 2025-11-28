require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./database/connectDB.js");
const requestLoger = require("./middlewares/loger.js");
const errorHandler = require("./middlewares/errorHandler.js");
const ArticleRoutes = require("./routes/article.route.js");

const app = express();
const PORT = process.env.PORT;
connectDB();

app.use(express.json());
app.use(cors("*"));

app.use(requestLoger);

app.use("/api",ArticleRoutes);

app.use(errorHandler);
app.listen(PORT, () => {
    console.log(`sever is listening on port ${PORT}`);
});