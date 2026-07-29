import axios from "axios";

const API = axios.create({
    baseURL:
        import.meta.env.VITE_API_URL ||
        "http://localhost:5000/api",
});

API.interceptors.response.use(
    (response) => response,
    (error) => {
        const isAuthRequest =
            error.config?.url?.startsWith("/auth");

        if (
            error.response?.status === 401 &&
            !isAuthRequest
        ) {
            localStorage.removeItem("fitness_token");
            localStorage.removeItem("fitness_user");

            window.location.assign("/auth");
        }

        return Promise.reject(error);
    }
);

API.interceptors.request.use((config) => {
    const token = localStorage.getItem("fitness_token");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

export default API;