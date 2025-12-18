require("dotenv").config();

const requiredEnvVars = [
  "JWT_SECRET",
  "MONGODB_URL",
  "REDIS_URL",
  "PORT"
];

// Check if all required environment variables exist
requiredEnvVars.forEach((varName) => {
  if (!process.env[varName]) {
    console.error(`Environment variable ${varName} is not set`);
    process.exit(1); // Exit app if a required env variable is missing
  }
});

module.exports = {
  jwtSecret: process.env.JWT_SECRET,
  mongoUrl: process.env.MONGODB_URL,
  redisUrl: process.env.REDIS_URL,
  port: process.env.PORT || 3000,
};