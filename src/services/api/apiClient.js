// apiClient.js
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

let authToken = localStorage.getItem("token") || null;

export const setAuthToken = (token) => {
  authToken = token;
  localStorage.setItem("token", token);
};

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  console.log("API Request:", config.url, "AuthToken:", authToken);
  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`;
  }

  const sessionId = localStorage.getItem("session_id");
  if (sessionId) {
    config.headers["X-Session-Id"] = sessionId;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error(
      `❌ API Error: ${error.response?.status} ${error.config?.url}`,
      error.message
    );

    if (error.response?.status === 401) {
      console.log("Unauthorized, clearing tokens...");
      authToken = null;
      localStorage.removeItem("token");
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      localStorage.removeItem("current_brand");

      if (!window.location.pathname.includes("/login")) {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
