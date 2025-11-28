const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
    console.log("MONGODB Conneted Successfully");
    } catch (error) {
        console.error("MONGODB Connection Failed", error.message);
        process.exit(1);
    }
}

module.exports = connectDB;