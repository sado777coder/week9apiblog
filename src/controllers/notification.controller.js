const Notification = require("../models/notification.model");

const getMyNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({
      user: req.user._id,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      message: "Notifications fetched",
      data: notifications,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getMyNotifications,
};