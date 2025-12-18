require("dotenv").config();
require("./src/config/redis");

const connectDB = require("./src/database/connectDB");
const app = require("./src/app");

const PORT = process.env.PORT || 3001;

// async startup function
const startServer = async () => {
  try {
    await connectDB();
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
  }

  app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
  });
};

startServer();