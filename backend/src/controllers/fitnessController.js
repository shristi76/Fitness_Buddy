const FitnessPlan = require("../models/FitnessPlan");
const genAI = require("../config/gemini");

const parsePlan = (responseText) => {
    const cleaned = responseText
        .replace(/```(?:json)?/gi, "")
        .trim();

    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");

    if (start === -1 || end === -1 || end < start) {
        throw new Error("The AI returned an invalid plan format.");
    }

    return JSON.parse(cleaned.slice(start, end + 1));
};

const isPositiveNumber = (value) =>
    Number.isFinite(Number(value)) && Number(value) > 0;

exports.generatePlan = async (req, res) => {
    try {
        const {
            name,
            age,
            gender,
            height,
            weight,
            goal,
            activity,
            food,
        } = req.body;

        if (
            ![name, gender, goal, activity, food].every(
                (value) =>
                    typeof value === "string" &&
                    value.trim()
            )
        ) {
            return res.status(400).json({
                message: "Please complete every fitness profile field.",
            });
        }

        if (
            !isPositiveNumber(age) ||
            !isPositiveNumber(height) ||
            !isPositiveNumber(weight)
        ) {
            return res.status(400).json({
                message:
                    "Age, height, and weight must be positive numbers.",
            });
        }

        if (
            Number(age) > 120 ||
            Number(height) > 300 ||
            Number(weight) > 500
        ) {
            return res.status(400).json({
                message:
                    "Please enter realistic age, height, and weight values.",
            });
        }

        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
            generationConfig: {
                responseMimeType: "application/json",
            },
        });

        const prompt = `
You are a professional fitness coach and certified nutritionist.

Based on the user's information, generate a personalized fitness plan.

User Information:
Name: ${name}
Age: ${age}
Gender: ${gender}
Height: ${height} cm
Weight: ${weight} kg
Goal: ${goal}
Activity Level: ${activity}
Food Preference: ${food}

Return ONLY valid JSON.

Do NOT include markdown.
Do NOT use triple backticks.
Do NOT include explanations before or after the JSON.

Return this exact structure:

{
  "bmi": "",
  "bmiStatus": "",
  "dailyCalories": "",
  "waterIntake": "",
  "workout": {
    "monday": "",
    "tuesday": "",
    "wednesday": "",
    "thursday": "",
    "friday": "",
    "saturday": "",
    "sunday": ""
  },
  "diet": {
    "breakfast": "",
    "lunch": "",
    "snacks": "",
    "dinner": ""
  },
  "foodsToAvoid": [],
  "tips": [],
  "summary": ""
}
`;

        const result = await model.generateContent(prompt);

        const responseText = result.response.text();
        const plan = parsePlan(responseText);

        const newPlan = await FitnessPlan.create({
            user: req.user._id,
            name,
            age,
            gender,
            height,
            weight,
            goal,
            activity,
            food,
            plan,
        });

        res.status(200).json(newPlan);
    } catch (error) {
        console.error("Plan generation failed:", error.message);

        const isInvalidPlan =
            error instanceof SyntaxError ||
            error.message ===
                "The AI returned an invalid plan format.";

        res.status(500).json({
            message: isInvalidPlan
                ? "The AI returned an unreadable plan. Please try again."
                : "Unable to generate your plan. Please try again.",
        });
    }
};

exports.getPlans = async (req, res) => {
    try {
        const plans = await FitnessPlan.find({
            user: req.user._id,
        }).sort({
            createdAt: -1,
        });

        res.json(plans);
    } catch {
        res.status(500).json({
            message: "Unable to load your plans.",
        });
    }
};

exports.deletePlan = async (req, res) => {
    try {
        const plan = await FitnessPlan.findOneAndDelete({
            _id: req.params.id,
            user: req.user._id,
        });

        if (!plan) {
            return res.status(404).json({
                message: "Plan not found.",
            });
        }

        res.json({
            message: "Plan deleted.",
        });
    } catch {
        res.status(400).json({
            message: "Invalid plan id.",
        });
    }
};