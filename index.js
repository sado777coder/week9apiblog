require("dotenv").config();
const connectDB = require("./src/database/connectDB");
const config = require("./src/config/config");
require("./src/config/redis");

const app = require("./src/app");

const PORT = process.env.PORT;


app.listen(config.PORT, async () => {
  await connectDB();
    console.log(`sever is listening on port ${PORT}`);
});