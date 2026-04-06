import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
  timeout: 10000,
});

// Add token to requests
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("adminToken");
    // Don't add token for login endpoint
    if (token && !config.url.includes("/login")) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Template Management
export const templateAPI = {
  getAllTemplates: async () => {
    const response = await API.get("/admin/company/reference-templates");
    return response.data;
  },
  updateTemplate: async (type, data) => {
    const response = await API.put(
      `/admin/company/reference-templates/${type}`,
      data,
    );
    return response.data;
  },
  createCustomTemplate: async (data) => {
    const response = await API.post(
      "/admin/company/reference-templates/custom",
      data,
    );
    return response.data;
  },
  deleteCustomTemplate: async (name) => {
    const response = await API.delete(
      `/admin/company/reference-templates/custom/${name}`,
    );
    return response.data;
  },
};

// User Management
export const userAPI = {
  getAllUsers: async (params = {}) => {
    const response = await API.get("/admin/users", { params });
    return response.data;
  },
  sendReferenceLetter: async (userId, data) => {
    const response = await API.post(
      `/admin/users/${userId}/reference-letter`,
      data,
    );
    return response.data;
  },
  getUserReferenceLetters: async (userId) => {
    const response = await API.get(`/admin/users/${userId}/reference-letters`);
    return response.data;
  },
  // Get single user by ID
  getUserById: async (userId) => {
    const response = await API.get(`/admin/users/${userId}`);
    return response.data;
  },

  // Update user
  updateUser: async (userId, userData) => {
    const response = await API.put(`/admin/users/${userId}`, userData);
    return response.data;
  },

  // Deactivate user (soft delete)
  deactivateUser: async (userId) => {
    const response = await API.delete(`/admin/users/${userId}`);
    return response.data;
  },

  // Reactivate user
  reactivateUser: async (userId) => {
    const response = await API.post(`/admin/users/${userId}/reactivate`);
    return response.data;
  },

  // Permanently delete user
  deleteUserPermanent: async (userId) => {
    const response = await API.delete(`/admin/users/${userId}/permanent`);
    return response.data;
  },

  // Bulk deactivate users
  bulkDeactivateUsers: async (userIds) => {
    const response = await API.post(`/admin/users/bulk-deactivate`, {
      userIds,
    });
    return response.data;
  },

  // Bulk reactivate users
  bulkReactivateUsers: async (userIds) => {
    const response = await API.post(`/admin/users/bulk-reactivate`, {
      userIds,
    });
    return response.data;
  },
  // Add this to your userAPI object

  /** Download reference letter for a user (admin)
  downloadUserReferenceLetter: async (userId, letterId) => {
    try {
      const token = localStorage.getItem("adminToken");
      // Encode the letterId to handle special characters like '/'
      const encodedLetterId = encodeURIComponent(letterId);

      const response = await fetch(
        `${API.defaults.baseURL}/admin/users/${userId}/reference-letters/${encodedLetterId}/download`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Download failed");
      }

      // Get the blob from response
      const blob = await response.blob();

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      // Sanitize filename
      const safeFileName = `reference-letter-${letterId.replace(/\//g, "-")}.pdf`;
      link.download = safeFileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      return { success: true };
    } catch (error) {
      console.error("Error downloading reference letter:", error);
      throw error;
    }
  }, **/

  // Update the downloadUserReferenceLetter function
  downloadUserReferenceLetter: async (userId, letterId) => {
    try {
      const token = localStorage.getItem("adminToken");

      // Use the PROXY endpoint instead of direct Cloudinary
      const response = await fetch(
        `${API.defaults.baseURL}/admin/users/${userId}/reference-letters/${encodeURIComponent(letterId)}/download-proxy`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Download failed:", response.status, errorText);
        throw new Error(`Download failed: ${response.status}`);
      }

      // Get the blob from response
      const blob = await response.blob();

      // Check if it's a PDF
      if (blob.type !== "application/pdf") {
        console.warn("Unexpected content type:", blob.type);
      }

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      // Sanitize filename
      const safeFileName = `reference-letter-${letterId.replace(/\//g, "-")}.pdf`;
      link.download = safeFileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up
      window.URL.revokeObjectURL(url);

      return { success: true };
    } catch (error) {
      console.error("Error downloading reference letter:", error);
      throw error;
    }
  },
};

// Auth
export const authAPI = {
  login: async (credentials) => {
    // ✅ FIXED: Use correct endpoint
    const response = await API.post("auth/admin/login", credentials);
    if (response.data.data?.token) {
      localStorage.setItem("adminToken", response.data.data.token);
    }
    return response.data;
  },
  logout: () => {
    localStorage.removeItem("adminToken");
  },
  verify: async () => {
    const response = await API.get("/auth/verify");
    return response.data;
  },
};
export default API;
