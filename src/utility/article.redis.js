const redisClient = require("../config/redis");

// Clear paginated articles cache
const clearArticlesCache = async () => {
  const keys = await redisClient.keys("articles:*");
  if (keys.length > 0) {
    await redisClient.del(...keys);
  }
};

// Get cached paginated articles
const getArticlesCache = async (key) => {
  const cached = await redisClient.get(key);
  return cached ? JSON.parse(cached) : null;
};

// Set paginated articles cache (ioredis FIX)
const setArticlesCache = async (key, data, ttl = 60) => {
  await redisClient.set(
    key,
    JSON.stringify(data),
    "EX",
    ttl
  );
};

// Get single article cache
const getArticleCache = async (id) => {
  const cached = await redisClient.get(`article:${id}`);
  return cached ? JSON.parse(cached) : null;
};

// Set single article cache (ioredis FIX)
const setArticleCache = async (id, data, ttl = 60) => {
  await redisClient.set(
    `article:${id}`,
    JSON.stringify(data),
    "EX",
    ttl
  );
};

// Delete single article cache
const deleteArticleCache = async (id) => {
  await redisClient.del(`article:${id}`);
};

module.exports = {
  clearArticlesCache,
  getArticlesCache,
  setArticlesCache,
  getArticleCache,
  setArticleCache,
  deleteArticleCache,
};