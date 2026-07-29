const crypto = require("crypto");

const User = require("../models/User");

const isEmail = (value) => /^\S+@\S+\.\S+$/.test(value);

const sendAuth = (user, statusCode, res) => {
    const header = Buffer.from(
        JSON.stringify({
            alg: "HS256",
            typ: "JWT",
        })
    ).toString("base64url");

    const payload = Buffer.from(
        JSON.stringify({
            id: user._id,
            exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60,
        })
    ).toString("base64url");

    const signature = crypto
        .createHmac("sha256", process.env.JWT_SECRET)
        .update(`${header}.${payload}`)
        .digest("base64url");

    const token = `${header}.${payload}.${signature}`;

    res.status(statusCode).json({
        token,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
        },
    });
};

exports.register = async (req, res) => {
    try {
        const name = req.body.name?.trim();
        const email = req.body.email?.trim().toLowerCase();
        const { password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Name, email, and password are required.",
            });
        }

        if (!isEmail(email)) {
            return res.status(400).json({
                message: "Enter a valid email address.",
            });
        }

        if (password.length < 4) {
            return res.status(400).json({
                message: "Password must be at least 4 characters.",
            });
        }

        if (await User.exists({ email })) {
            return res.status(409).json({
                message:
                    "An account with that email already exists. Please sign in instead.",
            });
        }

        const user = await User.create({
            name,
            email,
            password,
        });

        sendAuth(user, 201, res);
    } catch (error) {
        console.error("Registration failed:", error.message);

        if (error.code === 11000) {
            return res.status(409).json({
                message:
                    "An account with that email already exists. Please sign in instead.",
            });
        }

        res.status(500).json({
            message: "Unable to create your account. Please try again.",
        });
    }
};

exports.login = async (req, res) => {
    try {
        const email = req.body.email?.trim().toLowerCase();
        const { password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required.",
            });
        }

        const user = await User.findOne({ email }).select("+password");

        if (!user || !(await user.matchesPassword(password || ""))) {
            return res.status(401).json({
                message: "Incorrect email or password.",
            });
        }

        sendAuth(user, 200, res);
    } catch (error) {
        console.error("Login failed:", error.message);

        res.status(500).json({
            message: "Unable to sign in. Please try again.",
        });
    }
};