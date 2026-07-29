import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import API from "../services/api";
import Header from "../components/Header";

function History({ onSignOut }) {
    const [plans, setPlans] = useState([]);

    const loadPlans = async () => {
        try {
            const { data } = await API.get("/fitness");

            setPlans(data);
        } catch {
            toast.error("Unable to load your plans.");
        }
    };

    // Loading is intentionally triggered once when this protected page mounts.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    useEffect(() => {
        loadPlans();
    }, []);

    const deletePlan = async (id) => {
        try {
            await API.delete(`/fitness/${id}`);

            setPlans((currentPlans) =>
                currentPlans.filter((plan) => plan._id !== id)
            );

            toast.success("Plan deleted");
        } catch {
            toast.error("Unable to delete this plan.");
        }
    };

    return (
        <>
            <Header onSignOut={onSignOut} />

            <main className="history page-shell">
                <div className="history-heading">
                    <div>
                        <p className="eyebrow">YOUR PROGRESS</p>

                        <h1>Saved plans</h1>

                        <p>
                            Return to a routine whenever you
                            need it.
                        </p>
                    </div>

                    <Link
                        className="button-link"
                        to="/"
                    >
                        Create a plan
                    </Link>
                </div>

                {plans.length === 0 ? (
                    <div className="empty-state">
                        <h2>No plans yet</h2>

                        <p>
                            Your personalized routines will
                            appear here after you create one.
                        </p>

                        <Link
                            className="button-link"
                            to="/"
                        >
                            Create your first plan
                        </Link>
                    </div>
                ) : (
                    plans.map((item) => (
                        <article
                            className="saved-plan"
                            key={item._id}
                        >
                            <div>
                                <p className="plan-date">
                                    {new Date(
                                        item.createdAt
                                    ).toLocaleDateString()}
                                </p>

                                <h2>{item.goal} plan</h2>

                                <p>
                                    {item.name} · {item.activity} ·{" "}
                                    {item.food}
                                </p>
                            </div>

                            <details>
                                <summary>
                                    View plan
                                </summary>

                                <div className="plan-preview">
                                    <p>
                                        <strong>BMI:</strong>{" "}
                                        {item.plan?.bmi} ·{" "}
                                        {
                                            item.plan
                                                ?.bmiStatus
                                        }
                                    </p>

                                    <p>
                                        {
                                            item.plan
                                                ?.summary
                                        }
                                    </p>
                                </div>
                            </details>

                            <button
                                className="delete-button"
                                onClick={() =>
                                    deletePlan(item._id)
                                }
                            >
                                Delete
                            </button>
                        </article>
                    ))
                )}
            </main>
        </>
    );
}

export default History;