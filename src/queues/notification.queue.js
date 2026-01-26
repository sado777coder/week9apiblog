const { Queue } = require("bullmq");
const IORedis = require("ioredis");

// Redis connection
const connection = new IORedis(process.env.REDIS_URL);

// Create a queue named "notifications"
const notificationQueue = new Queue("notifications", {
  connection,
});

// Function to add a notification job
const addNotificationJob = async (data) => {
  await notificationQueue.add("send-notification", data);
};

module.exports = {
  notificationQueue,
  addNotificationJob,
};