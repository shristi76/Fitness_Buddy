const mongoose = require("mongoose");
const crypto = require("crypto");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            maxlength: 60,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
        },

        password: {
            type: String,
            required: true,
            minlength: 4,
            select: false,
        },
    },
    {
        timestamps: true,
    }
);

userSchema.pre("save", function hashPassword() {
    if (!this.isModified("password")) {
        return;
    }

    const salt = crypto.randomBytes(16).toString("hex");
    const hash = crypto
        .scryptSync(this.password, salt, 64)
        .toString("hex");

    this.password = `${salt}:${hash}`;
});

userSchema.methods.matchesPassword = function matchesPassword(password) {
    const [salt, storedHash] = this.password.split(":");

    if (!salt || !storedHash) {
        return false;
    }

    const hash = crypto.scryptSync(password, salt, 64);

    return crypto.timingSafeEqual(
        hash,
        Buffer.from(storedHash, "hex")
    );
};

module.exports = mongoose.model("User", userSchema);