const Redis = require("ioredis");

const redisClient = new Redis(process.env.REDIS_URL, {
  tls: {},
  maxRetriesPerRequest: 1,
  connectTimeout: 10000,
});

// DO NOT BLOCK SERVER START
redisClient.on("connect", () => {
  console.log("Redis connected");
});

redisClient.on("error", (err) => {
  console.error("Redis Error:", err.message);
});

module.exports = redisClient;