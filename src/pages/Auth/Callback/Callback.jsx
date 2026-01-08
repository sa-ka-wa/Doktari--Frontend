import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { setAuthToken } from "../../../services/api/apiClient";

const AuthCallback = () => {
  const navigate = useNavigate();
  const { updateUser } = useAuth();
  const [searchParams] = useSearchParams(); // Hook for query parameters

  useEffect(() => {
    const handleAuthentication = async () => {
      try {
        console.log("🔍 AuthCallback: Starting authentication process");
        console.log("🔍 Full URL:", window.location.href);

        let token = null;

        // 1. First try to get token from query parameters (NEW - preferred)
        token = searchParams.get("token");
        console.log("Token from query params:", token ? "Found" : "Not found");

        // 2. If not in query params, try hash fragment (OLD - for backward compatibility)
        if (!token) {
          const hash = window.location.hash;
          console.log("Checking hash fragment:", hash);
          if (hash) {
            const hashParams = new URLSearchParams(hash.replace("#", ""));
            token = hashParams.get("token");
            console.log("Token from hash:", token ? "Found" : "Not found");
          }
        }

        if (!token) {
          console.error("❌ No token found in URL");
          console.error("Search params:", window.location.search);
          console.error("Hash:", window.location.hash);
          navigate("/login?error=No+token+found+in+URL");
          return;
        }

        console.log("✅ Token found, length:", token.length);

        // ✅ Debug: Decode JWT to see what's inside
        try {
          const parts = token.split(".");
          if (parts.length === 3) {
            const payload = JSON.parse(atob(parts[1]));
            console.log("✅ JWT Payload:", payload);
            console.log("✅ JWT Subject (sub):", payload.sub);
            console.log("✅ JWT Expiry:", new Date(payload.exp * 1000));

            if (!payload.sub || typeof payload.sub !== "string") {
              console.warn("⚠️ JWT subject might be invalid:", payload.sub);
            }
          } else {
            console.error("❌ Invalid JWT format, expected 3 parts");
          }
        } catch (decodeError) {
          console.error("❌ Failed to decode JWT:", decodeError);
        }

        // ✅ Store token
        localStorage.setItem("authToken", token);
        localStorage.setItem("token", token);
        setAuthToken(token);

        // ✅ Clear the URL to prevent re-triggering
        window.history.replaceState(
          {},
          document.title,
          window.location.pathname
        );

        // ✅ Try to fetch profile
        try {
          const apiBaseUrl =
            import.meta.env.VITE_API_BASE_URL ||
            "https://backend-t-shirt.onrender.com";
          console.log(
            "🔄 Fetching profile from:",
            `${apiBaseUrl}/auth/profile`
          );

          const response = await fetch(`${apiBaseUrl}/auth/profile`, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });

          console.log("✅ Profile response status:", response.status);

          if (response.status === 401) {
            console.error("❌ 401 Unauthorized - Invalid token");
            throw new Error("Unauthorized - Invalid token");
          }

          if (!response.ok) {
            console.error(`❌ HTTP error! status: ${response.status}`);
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();
          console.log("✅ Profile data received:", data);

          const userData = data.user || data;
          localStorage.setItem("user", JSON.stringify(userData));
          updateUser(userData);

          console.log("✅ User authenticated:", userData.email);

          // Redirect based on user role
          setTimeout(() => {
            if (userData.role === "admin" || userData.role === "super_admin") {
              navigate("/admin/dashboard");
            } else if (
              userData.role === "brand_admin" ||
              userData.role === "brand_staff"
            ) {
              navigate("/staff/dashboard");
            } else {
              navigate("/profile");
            }
          }, 500);
        } catch (profileError) {
          console.error("❌ Error fetching profile:", profileError);

          // Try to get more info about the token
          try {
            const apiBaseUrl =
              import.meta.env.VITE_API_BASE_URL ||
              "https://backend-t-shirt.onrender.com";
            const tokenCheck = await fetch(`${apiBaseUrl}/auth/verify-token`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ token }),
            });

            if (tokenCheck.ok) {
              const tokenInfo = await tokenCheck.json();
              console.log("Token verification result:", tokenInfo);
            } else {
              console.error("Token verification failed:", tokenCheck.status);
            }
          } catch (verifyError) {
            console.error("Token verification failed:", verifyError);
          }

          // Clear invalid token
          localStorage.removeItem("authToken");
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setAuthToken(null);

          navigate(
            `/login?error=${encodeURIComponent(
              "Invalid token. Please try to login again."
            )}`
          );
        }
      } catch (error) {
        console.error("❌ Authentication error:", error);
        navigate(
          `/login?error=${encodeURIComponent(
            error.message || "Authentication failed"
          )}`
        );
      }
    };

    // Small delay to ensure React Router is ready
    setTimeout(() => {
      handleAuthentication();
    }, 100);
  }, [navigate, updateUser, searchParams]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-lg font-medium">Logging you in...</p>
        <p className="mt-2 text-sm text-gray-600">
          Please wait while we complete your authentication.
        </p>
        <p className="mt-1 text-xs text-gray-500">Checking token validity...</p>
        <div className="mt-4 p-4 bg-gray-100 rounded-lg text-left">
          <p className="text-xs font-mono">URL: {window.location.href}</p>
          <p className="text-xs font-mono mt-2">
            Token:{" "}
            {window.location.search.includes("token")
              ? "Detected in URL"
              : "Not found"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthCallback;
