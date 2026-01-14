const rateLimit = require("express-rate-limit");
const RedisStore = require("rate-limit-redis").default; // <-- fix here
const Redis = require("ioredis");

// Create Redis client (Upstash supports rediss://)
const redisClient = new Redis(process.env.REDIS_URL, {
  tls: {},
  maxRetriesPerRequest: 1,
  connectTimeout: 10000,
});

// Always non-blocking
redisClient.on("connect", () => console.log("Redis connected"));
redisClient.on("error", (err) => console.error("Redis Error:", err.message));

// Rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  store: new RedisStore({
    sendCommand: (...args) => redisClient.call(...args), // ioredis compatible
  }),
});

module.exports = limiter;