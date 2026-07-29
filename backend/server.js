const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const connectDB = require("./src/config/db");

dotenv.config();

// Validate required environment variables
if (!process.env.JWT_SECRET) {
    console.error(
        "JWT_SECRET is missing. Add it to backend/.env before starting the server."
    );
    process.exit(1);
}

const app = express();

// Middleware
app.use(
    cors({
        origin: process.env.CLIENT_URL || "http://localhost:5173",
    })
);

app.use(
    express.json({
        limit: "1mb",
    })
);

// Routes
app.get("/api/health", (_req, res) => {
    res.json({ status: "ok" });
});

app.use("/api/auth", require("./src/routes/authRoutes"));
app.use("/api/fitness", require("./src/routes/fitnessRoutes"));

// 404 Handler
app.use((req, res) => {
    res.status(404).json({
        message: `Route ${req.method} ${req.originalUrl} was not found.`,
    });
});

// Global Error Handler
app.use((error, _req, res, _next) => {
    console.error("Unhandled request error:", error.message);

    res.status(500).json({
        message: "Something went wrong. Please try again.",
    });
});

const PORT = process.env.PORT || 5000;

// Start Server
const startServer = async () => {
    try {
        await connectDB();

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error(error.message);
        process.exit(1);
    }
};

startServer();