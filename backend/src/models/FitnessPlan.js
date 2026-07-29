const mongoose = require("mongoose");

const fitnessSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        name: String,

        age: Number,

        gender: String,

        height: Number,

        weight: Number,

        goal: String,

        activity: String,

        food: String,

        // plan: String
        plan: {
            type: Object,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("FitnessPlan", fitnessSchema);