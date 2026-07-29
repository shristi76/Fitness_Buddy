import { useState } from "react";
import API from "../services/api";
import { downloadPDF } from "../utility/pdf";
import toast from "react-hot-toast";

function FitnessForm() {
  const [form, setForm] = useState({
    name: "",
    age: "",
    gender: "",
    height: "",
    weight: "",
    goal: "",
    activity: "",
    food: "",
  });

  const [plan, setPlan] = useState(null);

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const calculateBMI = () => {
    if (!form.height || !form.weight) return "";

    const height = Number(form.height) / 100;
    const weight = Number(form.weight);

    if (!Number.isFinite(height) || !Number.isFinite(weight) || height <= 0 || weight <= 0) return "";

    return (weight / (height * height)).toFixed(1);
  };

  const bmi = calculateBMI();

  const bmiStatus = () => {
    if (!bmi) return "";

    if (bmi < 18.5) return "Underweight";

    if (bmi < 25) return "Healthy";

    if (bmi < 30) return "Overweight";

    return "Obese";
  };

  const validate = () => {
    if (
      !form.name ||
      !form.age ||
      !form.gender ||
      !form.height ||
      !form.weight ||
      !form.goal ||
      !form.activity ||
      !form.food
    ) {
      toast.error("Please fill all fields");
      return false;
    }

    if (Number(form.age) <= 0 || Number(form.age) > 120 || Number(form.height) <= 0 || Number(form.height) > 300 || Number(form.weight) <= 0 || Number(form.weight) > 500) {
      toast.error("Please enter realistic age, height, and weight values");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      setLoading(true);

      const res = await API.post("/fitness/generate", form);

      setPlan(res.data.plan);

      toast.success("Fitness Plan Generated");
    } catch (err) {
      toast.error(err.response?.data?.message || "Unable to generate your plan.");

      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="form" className="form-section">
      <div className="section-heading"><p className="eyebrow">PERSONALIZED FOR YOU</p><h2>Build your fitness plan</h2><p>Tell us a little about yourself. We’ll do the planning.</p></div>

      <form className="fitness-form" onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
        />

        <input
          type="number"
          name="age"
          min="1"
          max="120"
          required
          placeholder="Age"
          value={form.age}
          onChange={handleChange}
        />

        <select
          name="gender"
          value={form.gender}
          onChange={handleChange}
        >
          <option value="">Select Gender</option>

          <option>Male</option>

          <option>Female</option>
        </select>

        <input
          type="number"
          name="height"
          min="1"
          max="300"
          required
          placeholder="Height (cm)"
          value={form.height}
          onChange={handleChange}
        />

        <input
          type="number"
          name="weight"
          min="1"
          max="500"
          required
          placeholder="Weight (kg)"
          value={form.weight}
          onChange={handleChange}
        />

        <select
          name="goal"
          value={form.goal}
          onChange={handleChange}
        >
          <option value="">Fitness Goal</option>

          <option>Weight Loss</option>

          <option>Weight Gain</option>

          <option>Maintain Weight</option>
        </select>

        <select
          name="activity"
          value={form.activity}
          onChange={handleChange}
        >
          <option value="">Activity Level</option>

          <option>Beginner</option>

          <option>Intermediate</option>

          <option>Advanced</option>
        </select>

        <select
          name="food"
          value={form.food}
          onChange={handleChange}
        >
          <option value="">Food Preference</option>

          <option>Vegetarian</option>

          <option>Non-Vegetarian</option>

          <option>Vegan</option>
        </select>

        {bmi && (
          <div className="bmi-box">
            <h3>Your BMI</h3>

            <h1>{bmi}</h1>

            <p>{bmiStatus()}</p>
          </div>
        )}

        <button disabled={loading}>
          {loading ? "Generating..." : "Generate Fitness Plan"}
        </button>
      </form>

      {loading && (
        <div className="loader">
          <h2>AI is creating your personalized plan...</h2>
        </div>
      )}

    {plan && (
  <div className="result" id="plan">

    <h2>Your Personalized Fitness Plan</h2>

    {/* Body Analysis */}
    <div className="card">
      <h3>Body Analysis</h3>

      <p><strong>BMI:</strong> {plan.bmi}</p>

      <p><strong>Status:</strong> {plan.bmiStatus}</p>

      <p><strong>Daily Calories:</strong> {plan.dailyCalories}</p>

      <p><strong>Water Intake:</strong> {plan.waterIntake}</p>
    </div>

    {/* Diet Plan */}
    <div className="card">

      <h3>Diet Plan</h3>

      <p>
        <strong>Breakfast:</strong> {plan.diet?.breakfast}
      </p>

      <p>
        <strong>Lunch:</strong> {plan.diet?.lunch}
      </p>

      <p>
        <strong>Snacks:</strong> {plan.diet?.snacks}
      </p>

      <p>
        <strong>Dinner:</strong> {plan.diet?.dinner}
      </p>

    </div>

    {/* Workout Plan */}

    <div className="card">

      <h3>Weekly Workout Plan</h3>

      <p><strong>Monday:</strong> {plan.workout?.monday}</p>

      <p><strong>Tuesday:</strong> {plan.workout?.tuesday}</p>

      <p><strong>Wednesday:</strong> {plan.workout?.wednesday}</p>

      <p><strong>Thursday:</strong> {plan.workout?.thursday}</p>

      <p><strong>Friday:</strong> {plan.workout?.friday}</p>

      <p><strong>Saturday:</strong> {plan.workout?.saturday}</p>

      <p><strong>Sunday:</strong> {plan.workout?.sunday}</p>

    </div>

    {/* Foods To Avoid */}

    <div className="card">

      <h3> Foods To Avoid</h3>

      <ul>

        {plan.foodsToAvoid?.map((food, index) => (

          <li key={index}>{food}</li>

        ))}

      </ul>

    </div>

    {/* Tips */}

    <div className="card">

      <h3>Fitness Tips</h3>

      <ul>

        {plan.tips?.map((tip, index) => (

          <li key={index}>{tip}</li>

        ))}

      </ul>

    </div>

    {/* Summary */}

    <div className="card">

      <h3>Summary</h3>

      <p>{plan.summary}</p>

    </div>

    <button
      className="download-btn"
      onClick={async () => { try { await downloadPDF("plan"); } catch { toast.error("Unable to download the plan. Please try again."); } }}
    >
      Download PDF
    </button>

  </div>
)}
    </section>
  );
}

export default FitnessForm;
