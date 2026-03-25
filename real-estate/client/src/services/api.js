import axios from "axios";

// Get the base URL from environment variable with fallback
const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const API = axios.create({
  baseURL: BASE_URL,
  timeout: 10000, // 10 second timeout
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - adds token to every request
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // For admin authentication
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor - handles common errors
API.interceptors.response.use(
  (response) => {
    // Return just the data part of the response for cleaner code
    return response.data;
  },
  (error) => {
    // Handle common errors
    if (error.response) {
      // Server responded with error status
      const { status } = error.response;

      switch (status) {
        case 401:
          // Unauthorized - token expired or invalid
          console.log("Session expired. Please login again.");
          localStorage.removeItem("token");
          // You could redirect to login page here
          break;
        case 403:
          console.log("You do not have permission to perform this action.");
          break;
        case 404:
          console.log("Resource not found.");
          break;
        case 500:
          console.log("Server error. Please try again later.");
          break;
        default:
          console.log(
            `Error ${status}:`,
            error.response.data?.message || "Unknown error",
          );
      }
    } else if (error.request) {
      // Request was made but no response received
      console.log("No response from server. Please check your connection.");
    } else {
      // Something else happened
      console.log("Error:", error.message);
    }

    return Promise.reject(error);
  },
);

// API service functions for company info
export const companyAPI = {
  // Get company information (public)
  getCompanyInfo: async () => {
    try {
      const response = await API.get("/company");
      return response.data; // Already unwrapped by interceptor
    } catch (error) {
      console.error("Error fetching company info:", error);
      throw error;
    }
  },

  // Update company information (admin only - requires token)
  updateCompanyInfo: async (companyData) => {
    try {
      const response = await API.put("/admin/company", companyData);
      return response.data;
    } catch (error) {
      console.error("Error updating company info:", error);
      throw error;
    }
  },
};

// API service functions for properties
export const propertyAPI = {
  // Get all properties with optional filters
  getProperties: async (filters = {}) => {
    try {
      const params = new URLSearchParams(filters).toString();
      const response = await API.get(
        `/properties${params ? `?${params}` : ""}`,
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching properties:", error);
      throw error;
    }
  },

  // Get featured properties
  getFeaturedProperties: async () => {
    try {
      const response = await API.get("/properties/featured");
      return response.data;
    } catch (error) {
      console.error("Error fetching featured properties:", error);
      throw error;
    }
  },

  // Get single property by ID
  getPropertyById: async (id) => {
    try {
      const response = await API.get(`/properties/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching property:", error);
      throw error;
    }
  },
};

// API service functions for agents
export const agentAPI = {
  getAllAgents: async () => {
    try {
      const response = await API.get("/agents");
      return response.data;
    } catch (error) {
      console.error("Error fetching agents:", error);
      throw error;
    }
  },

  getFeaturedAgents: async () => {
    try {
      const response = await API.get("/agents/featured");
      return response.data;
    } catch (error) {
      console.error("Error fetching featured agents:", error);
      throw error;
    }
  },
};

// API service functions for testimonials
export const testimonialAPI = {
  getAllTestimonials: async () => {
    try {
      const response = await API.get("/testimonials");
      return response.data;
    } catch (error) {
      console.error("Error fetching testimonials:", error);
      throw error;
    }
  },
};

// API service functions for inquiries (contact form)
export const inquiryAPI = {
  submitInquiry: async (inquiryData) => {
    try {
      const response = await API.post("/inquiries", inquiryData);
      return response.data;
    } catch (error) {
      console.error("Error submitting inquiry:", error);
      throw error;
    }
  },
};

// API service functions for newsletter
export const newsletterAPI = {
  subscribe: async (email, preferences = []) => {
    try {
      const response = await API.post("/newsletter", { email, preferences });
      return response.data;
    } catch (error) {
      console.error("Error subscribing to newsletter:", error);
      throw error;
    }
  },
};

// API service functions for authentication (admin)
export const authAPI = {
  login: async (username, password) => {
    try {
      const response = await API.post("/auth/login", { username, password });

      // If login successful and token returned, store it
      if (response.data?.token) {
        localStorage.setItem("token", response.data.token);
      }

      return response.data;
    } catch (error) {
      console.error("Error logging in:", error);
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem("token");
  },

  verifyToken: async () => {
    try {
      const response = await API.get("/auth/verify");
      return response.data;
    } catch (error) {
      localStorage.removeItem("token");
      throw error;
    }
  },
};

// Default export with all APIs
export default {
  company: companyAPI,
  property: propertyAPI,
  agent: agentAPI,
  testimonial: testimonialAPI,
  inquiry: inquiryAPI,
  newsletter: newsletterAPI,
  auth: authAPI,
};
