require("dotenv").config();
require("./src/config/redis");

const connectDB = require("./src/database/connectDB");
const app = require("./src/app");

const PORT = Number(process.env.PORT) || 3001;

// 1️Start server FIRST 
const server = app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

//  Do async startup work AFTER port is open
(async () => {
  try {
    await connectDB();
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
  }
})();