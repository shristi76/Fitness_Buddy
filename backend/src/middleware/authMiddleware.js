const crypto = require("crypto");

const User = require("../models/User");

exports.protect = async (req, res, next) => {
    const authorization = req.headers.authorization || "";

    const token = authorization.startsWith("Bearer ")
        ? authorization.slice(7)
        : null;

    if (!token) {
        return res.status(401).json({
            message: "Please sign in to continue.",
        });
    }

    try {
        const [header, payload, signature] = token.split(".");

        if (!header || !payload || !signature) {
            throw new Error("Malformed token");
        }

        const expected = crypto
            .createHmac("sha256", process.env.JWT_SECRET)
            .update(`${header}.${payload}`)
            .digest("base64url");

        const receivedSignature = Buffer.from(signature);
        const expectedSignature = Buffer.from(expected);

        if (
            receivedSignature.length !== expectedSignature.length ||
            !crypto.timingSafeEqual(
                receivedSignature,
                expectedSignature
            )
        ) {
            throw new Error("Invalid token");
        }

        const decoded = JSON.parse(
            Buffer.from(payload, "base64url").toString("utf8")
        );

        if (
            !decoded.exp ||
            decoded.exp < Math.floor(Date.now() / 1000)
        ) {
            throw new Error("Expired token");
        }

        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(401).json({
                message: "Your account is no longer available.",
            });
        }

        req.user = user;

        next();
    } catch {
        res.status(401).json({
            message: "Your session has expired. Please sign in again.",
        });
    }
};