import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import API from "../services/api";

function Auth({ onAuthenticated }) {
    const [isRegistering, setIsRegistering] = useState(false);

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const updateField = (event) => {
        setForm({
            ...form,
            [event.target.name]: event.target.value,
        });
    };

    const switchMode = () => {
        setIsRegistering(!isRegistering);

        setForm({
            name: "",
            email: "",
            password: "",
        });
    };

    const submit = async (event) => {
        event.preventDefault();

        setLoading(true);

        try {
            const payload = isRegistering
                ? form
                : {
                      email: form.email,
                      password: form.password,
                  };

            const { data } = await API.post(
                isRegistering ? "/auth/register" : "/auth/login",
                payload
            );

            localStorage.setItem("fitness_token", data.token);
            localStorage.setItem(
                "fitness_user",
                JSON.stringify(data.user)
            );

            onAuthenticated();

            toast.success(
                isRegistering
                    ? "Account created successfully"
                    : "Welcome back"
            );

            navigate("/");
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                    "Unable to reach the server. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="auth-page">
            <section className="auth-card">
                <div className="auth-intro">
                    {/* <span className="brand-mark">FB</span> */}

                    <p className="eyebrow">FITNESS BUDDY</p>

                    <h1>Build healthy habits that last.</h1>

                    <p>
                        Personalized fitness and nutrition planning,
                        designed around you.
                    </p>
                </div>

                <form
                    className="auth-form"
                    onSubmit={submit}
                >
                    <div>
                        <h2>
                            {isRegistering
                                ? "Create your account"
                                : "Welcome back"}
                        </h2>

                        <p>
                            {isRegistering
                                ? "Start planning your fitness journey today."
                                : "Sign in to access your fitness plans."}
                        </p>
                    </div>

                    {isRegistering && (
                        <label>
                            Full name
                            <input
                                name="name"
                                required
                                value={form.name}
                                onChange={updateField}
                                placeholder="Your full name"
                            />
                        </label>
                    )}

                    <label>
                        Email address
                        <input
                            name="email"
                            type="email"
                            required
                            value={form.email}
                            onChange={updateField}
                            placeholder="you@example.com"
                        />
                    </label>

                    <label>
                        Password
                        <input
                            name="password"
                            type="password"
                            required
                            minLength="4"
                            value={form.password}
                            onChange={updateField}
                            placeholder="At least 4 characters"
                        />
                    </label>

                    <button disabled={loading}>
                        {loading
                            ? "Please wait..."
                            : isRegistering
                            ? "Create account"
                            : "Sign in"}
                    </button>

                    <p className="switch-auth">
                        {isRegistering
                            ? "Already have an account?"
                            : "New to Fitness Buddy?"}{" "}
                        <button
                            type="button"
                            onClick={switchMode}
                        >
                            {isRegistering
                                ? "Sign in"
                                : "Create an account"}
                        </button>
                    </p>
                </form>
            </section>
        </main>
    );
}

export default Auth;