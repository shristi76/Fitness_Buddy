import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useState } from "react";
import { Toaster } from "react-hot-toast";

import Auth from "./pages/Auth";
import Home from "./pages/Home";
import History from "./pages/History";

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(() =>
        Boolean(localStorage.getItem("fitness_token"))
    );

    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/auth"
                    element={
                        isAuthenticated ? (
                            <Navigate
                                to="/"
                                replace
                            />
                        ) : (
                            <Auth
                                onAuthenticated={() =>
                                    setIsAuthenticated(true)
                                }
                            />
                        )
                    }
                />

                <Route
                    path="/"
                    element={
                        isAuthenticated ? (
                            <Home
                                onSignOut={() =>
                                    setIsAuthenticated(false)
                                }
                            />
                        ) : (
                            <Navigate
                                to="/auth"
                                replace
                            />
                        )
                    }
                />

                <Route
                    path="/history"
                    element={
                        isAuthenticated ? (
                            <History
                                onSignOut={() =>
                                    setIsAuthenticated(false)
                                }
                            />
                        ) : (
                            <Navigate
                                to="/auth"
                                replace
                            />
                        )
                    }
                />

                <Route
                    path="*"
                    element={
                        <Navigate
                            to="/"
                            replace
                        />
                    }
                />
            </Routes>

            <Toaster position="top-right" />
        </BrowserRouter>
    );
}

export default App;