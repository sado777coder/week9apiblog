const { Worker } = require("bullmq");
const IORedis = require("ioredis");
const mongoose = require("mongoose");
require("dotenv").config();

const Notification = require("../models/notification.model");
const { sendEmail } = require("../utility/email");

// Redis connection
const connection = new IORedis(process.env.REDIS_URL, {
  maxRetriesPerRequest: null,
});

// MongoDB connection (workers connect separately)
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log(" Worker MongoDB connected"))
  .catch((err) => console.error(" Worker MongoDB error:", err));

console.log(" Notification worker is running...");

new Worker(
  "notifications",
  async (job) => {
    const { userId, type, message, email } = job.data;

    await Notification.create({
      user: userId,
      type,
      message,
    });

    if (email) {
      await sendEmail(email, "New Notification", message);
    }

    console.log(`📩 Notification processed: ${type}`);
  },
  { connection }
);