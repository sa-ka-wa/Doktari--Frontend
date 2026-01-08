import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { setAuthToken } from "../../../services/api/apiClient";

const AuthCallback = () => {
  const navigate = useNavigate();
  const { updateUser } = useAuth();

  useEffect(() => {
    const handleAuthentication = async () => {
      try {
        // Get token from URL hash
        const hash = window.location.hash;
        console.log("URL Hash:", hash);

        const params = new URLSearchParams(hash.replace("#", ""));
        const token = params.get("token");

        console.log("Token from URL:", token);

        if (!token) {
          console.error("No token found in URL");
          navigate("/login?error=No+token+found");
          return;
        }

        // ✅ Debug: Decode JWT to see what's inside (client-side only)
        try {
          const payload = JSON.parse(atob(token.split(".")[1]));
          console.log("JWT Payload:", payload);
          console.log("JWT Subject (sub):", payload.sub);
          console.log("JWT Expiry:", new Date(payload.exp * 1000));

          if (!payload.sub || typeof payload.sub !== "string") {
            console.error("JWT has invalid subject:", payload.sub);
          }
        } catch (decodeError) {
          console.error("Failed to decode JWT:", decodeError);
        }

        // ✅ Store token
        localStorage.setItem("authToken", token);
        localStorage.setItem("token", token);
        setAuthToken(token);

        // ✅ Clear the URL hash to prevent re-triggering
        window.location.hash = "";

        // ✅ Try to fetch profile
        try {
          const response = await fetch(
            `${import.meta.env.VITE_API_BASE_URL}/auth/profile`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );

          console.log("Profile response status:", response.status);

          if (response.status === 401) {
            throw new Error("Unauthorized - Invalid token");
          }

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();
          console.log("Profile data:", data);

          const userData = data.user || data;
          localStorage.setItem("user", JSON.stringify(userData));
          updateUser(userData);

          // Redirect to profile
          navigate("/profile");
        } catch (profileError) {
          console.error("Error fetching profile:", profileError);

          // Try to get more info about the token
          const tokenCheck = await fetch(
            `${import.meta.env.VITE_API_BASE_URL}/auth/verify-token`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ token }),
            }
          );

          if (tokenCheck.ok) {
            const tokenInfo = await tokenCheck.json();
            console.log("Token verification result:", tokenInfo);
          }

          // Clear invalid token
          localStorage.removeItem("authToken");
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setAuthToken(null);

          navigate(
            `/login?error=${encodeURIComponent(
              "Invalid token. Please try again."
            )}`
          );
        }
      } catch (error) {
        console.error("Authentication error:", error);
        navigate(
          `/login?error=${encodeURIComponent(
            error.message || "Authentication failed"
          )}`
        );
      }
    };

    handleAuthentication();
  }, [navigate, updateUser]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-lg font-medium">Logging you in...</p>
        <p className="mt-2 text-sm text-gray-600">
          Please wait while we complete your authentication.
        </p>
        <p className="mt-1 text-xs text-gray-500">Checking token validity...</p>
      </div>
    </div>
  );
};

export default AuthCallback;
