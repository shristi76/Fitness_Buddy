const mongoose = require("mongoose");

const connectDB = async () => {
    // Check if MongoDB URI exists
    if (!process.env.MONGO_URI) {
        throw new Error(
            "MONGO_URI is missing. Add it to backend/.env before starting the server."
        );
    }

    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI);

        console.log("MongoDB Connected");

        return mongoose.connection;
    } catch (error) {
        throw new Error(
            `MongoDB connection failed: ${error.message}`
        );
    }
};

module.exports = connectDB;