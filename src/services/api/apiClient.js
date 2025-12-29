import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 second timeout
});

// Attach token automatically
apiClient.interceptors.request.use((config) => {
  // Get token from localStorage (try multiple keys)
  const token = localStorage.getItem("authToken") || 
                localStorage.getItem("token") || 
                localStorage.getItem("access_token");
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  // Add subdomain header for brand detection
  // const hostname = window.location.hostname;
  // if (hostname.includes('.lvh.me')) {
  //   const subdomain = hostname.split('.')[0];
  //   config.headers['X-Subdomain'] = subdomain;
  // }
  
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Add response interceptor
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
    
    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      console.log("Unauthorized, clearing tokens...");
      localStorage.removeItem("authToken");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("current_brand");
      
      // Redirect to login if not already there
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    
    // Handle 404 for brand not found
    if (error.response?.status === 404 && error.config?.url.includes('/brands/')) {
      console.warn("Brand not found, might need to create it or check subdomain");
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;