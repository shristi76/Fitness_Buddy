const express = require("express");

const router = express.Router();

const {
    generatePlan,
    getPlans,
    deletePlan,
} = require("../controllers/fitnessController");

const { protect } = require("../middleware/authMiddleware");

// Protected routes
router.use(protect);

router.post("/generate", generatePlan);
router.get("/", getPlans);
router.delete("/:id", deletePlan);

module.exports = router;