import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const API = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
});

//Add token to requests
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

/**  Request interceptor - adds token to every request
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
); **/

// Response interceptor - handles common errors
API.interceptors.response.use(
  (response) => {
    console.log("🔄 Interceptor - Response:", response);
    console.log("🔄 Interceptor - Response.data:", response.data);
    return response;
  },
  (error) => {
    console.log("🔄 Interceptor - Error:", error);
    if (error.response) {
      const { status } = error.response;
      const errorMessage = error.response.data?.error || error.response.data?.message || '';

      switch (status) {
        case 401:
          // ✅ Show session expired toast
          if (errorMessage.toLowerCase().includes('expired') || 
              errorMessage.toLowerCase().includes('token expired')) {
            toast.warning('⏰ Session expired. Please login again.');
          } else {
            toast.error(errorMessage || 'Session expired. Please login again.');
          }
          
          console.log("Session expired. Please login again.");
          localStorage.removeItem("adminToken");
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          localStorage.removeItem("rememberedEmail");
          localStorage.removeItem("rememberMe");
          
          // Redirect to admin login
          if (window.location.pathname !== "/admin/login") {
            setTimeout(() => {
              window.location.href = "/admin/login";
            }, 500);
          }
          break;
        case 403:
          toast.error('You do not have permission to perform this action.');
          break;
        case 404:
          toast.error('Resource not found.');
          break;
        case 500:
          toast.error('Server error. Please try again later.');
          break;
        default:
          const msg = error.response.data?.message || error.response.data?.error || 'Unknown error';
          toast.error(msg);
          console.log(`Error ${status}:`, msg);
      }
    } else if (error.request) {
      toast.error('No response from server. Please check your connection.');
      console.log("No response from server. Please check your connection.");
    } else {
      toast.error('Error: ' + error.message);
      console.log("Error:", error.message);
    }

    return Promise.reject(error);
  },
);

// ==================== USER API (For regular users) ====================
const usersAPI = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to user requests
usersAPI.interceptors.request.use(
  (config) => {
    // Don't add token for public auth endpoints
    const isPublicAuth =
      config.url?.includes("/login") ||
      config.url?.includes("/register") ||
      config.url?.includes("/forgot-password") ||
      config.url?.includes("/reset-password") ||
      config.url?.includes("/verify-email");

    if (!isPublicAuth) {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor for user API
usersAPI.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      const errorMessage = error.response?.data?.error || error.response?.data?.message || '';

      // ✅ Show session expired toast
      if (errorMessage.toLowerCase().includes('expired') || 
          errorMessage.toLowerCase().includes('token expired')) {
        toast.warning('⏰ Session expired. Please login again.');
      } else {
        toast.error(errorMessage || 'Session expired. Please login again.');
      }

      // Clear user data
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("rememberedEmail");
      localStorage.removeItem("rememberMe");
      localStorage.removeItem("tokenData");

      // Redirect to login
      if (
        !window.location.pathname.includes("/login") &&
        !window.location.pathname.includes("/signup") &&
        !window.location.pathname.includes("/verify-email")
      ) {
        setTimeout(() => {
          window.location.href = "/login";
        }, 500);
      }
    }
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

   // ========== NEW VERSION (No Puppeteer) ==========
  sendReferenceLetterNew: async (userId, data) => {
    const response = await API.post(
      `/admin/users/${userId}/reference-letter-new`,
      data,
    );
    return response.data;
  },

    // ========== NEW VERSION (React-PDF) - ADD THIS ==========
  sendReferenceLetterPDF3: async (userId, data) => {
    const response = await API.post(
      `/admin/users/${userId}/reference-letter-pdf3`,
      data,
    );
    return response.data;
  },

  previewReferenceLetterNew: async (userId) => {
    const response = await API.get(
      `/admin/users/${userId}/reference-letter-preview-new`,
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

export const inquiryAPI = {
  getAllInquiries: async (params = {}) => {
    const response = await API.get("/admin/inquiries", { params });
    return response.data;
  },
  getInquiryById: async (id) => {
    const response = await API.get(`/admin/inquiries/${id}`);
    return response.data;
  },
  updateStatus: async (id, status) => {
    const response = await API.patch(`/admin/inquiries/${id}/status`, {
      status,
    });
    return response.data;
  },
  deleteInquiry: async (id) => {
    const response = await API.delete(`/admin/inquiries/${id}`);
    return response.data;
  },
};

// Testimonial API (public)
export const testimonialAPI = {
  // Get all approved testimonials (public)
  getAllTestimonials: async (params = {}) => {
    const response = await API.get("/testimonials", { params });
    return response.data;
  },

  // Get all testimonials (including pending/rejected) - Admin only
  getAllTestimonialsAdmin: async (params = {}) => {
    const response = await API.get("/admin/testimonials", { params });
    return response.data;
  },

  // Get featured testimonials (public)
  getFeaturedTestimonials: async (limit = 3) => {
    const response = await API.get(`/testimonials/featured?limit=${limit}`);
    return response.data;
  },

  // Get single testimonial (public)
  getTestimonialById: async (id) => {
    const response = await API.get(`/testimonials/${id}`);
    return response.data;
  },

  // ==================== ADMIN ROUTES (Requires Authentication) ====================

  // Get all testimonials (including pending/rejected) - Admin only
  getAllTestimonialsAdmin: async (params = {}) => {
    const response = await API.get("/admin/testimonials", { params });
    return response.data;
  },

  // Get pending testimonials specifically
  getPendingTestimonials: async () => {
    const response = await API.get("/admin/testimonials/pending");
    return response.data;
  },

  // Get rejected testimonials specifically
  getRejectedTestimonials: async () => {
    const response = await API.get("/admin/testimonials/rejected");
    return response.data;
  },

  // Get approved testimonials specifically
  getApprovedTestimonials: async () => {
    const response = await API.get("/admin/testimonials/approved");
    return response.data;
  },

  // Create new testimonial with optional image - Admin only
  createTestimonial: async (formData) => {
    const response = await API.post("/admin/testimonials", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  // Update testimonial text fields - Admin only
  updateTestimonial: async (id, data) => {
    const response = await API.put(`/admin/testimonials/${id}`, data);
    return response.data;
  },

  // Upload/replace testimonial image - Admin only
  uploadTestimonialImage: async (id, imageFile) => {
    const formData = new FormData();
    formData.append("image", imageFile);
    const response = await API.post(
      `/admin/testimonials/${id}/image`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      },
    );
    return response.data;
  },

  // Delete testimonial image only - Admin only
  deleteTestimonialImage: async (id) => {
    const response = await API.delete(`/admin/testimonials/${id}/image`);
    return response.data;
  },

  // Delete testimonial completely (with image) - Admin only
  deleteTestimonial: async (id) => {
    const response = await API.delete(`/admin/testimonials/${id}`);
    return response.data;
  },

  // Approve testimonial - Admin only
  approveTestimonial: async (id) => {
    const response = await API.patch(`/admin/testimonials/${id}/approve`);
    return response.data;
  },

  // Reject testimonial - Admin only
  rejectTestimonial: async (id) => {
    const response = await API.patch(`/admin/testimonials/${id}/reject`);
    return response.data;
  },

  // Toggle featured status - Admin only
  toggleFeatured: async (id) => {
    const response = await API.patch(`/admin/testimonials/${id}/featured`);
    return response.data;
  },

  // Bulk delete testimonials - Admin only
  bulkDeleteTestimonials: async (ids) => {
    const response = await API.post("/admin/testimonials/bulk-delete", { ids });
    return response.data;
  },

  // Bulk update status - Admin only
  bulkUpdateStatus: async (ids, status) => {
    const response = await API.post("/admin/testimonials/bulk-status", {
      ids,
      status,
    });
    return response.data;
  },
};

// Company Management (Admin)
export const companyAPI = {
  // Get company information (public)
  getCompanyInfo: async () => {
    const response = await API.get("/company");
    return response.data;
  },

  // Update entire company (admin)
  updateCompany: async (data) => {
    const response = await API.put("/admin/company", data);
    return response.data;
  },

  // Update specific section (e.g., basic, contact, social)
  updateCompanySection: async (section, data) => {
    const response = await API.patch(`/admin/company/${section}`, data);
    return response.data;
  },

  // Update specific field in a section
  updateCompanyField: async (section, field, data) => {
    const response = await API.patch(
      `/admin/company/${section}/${field}`,
      data,
    );
    return response.data;
  },

  // Update signatory information
  updateSignatory: async (data) => {
    const response = await API.patch("/admin/company/signatory", data);
    return response.data;
  },

  // Upload signature image
  uploadSignature: async (imageFile) => {
    const formData = new FormData();
    formData.append("signature", imageFile);
    const response = await API.post("/admin/company/signature", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  // Delete signature
  deleteSignature: async () => {
    const response = await API.delete("/admin/company/signature");
    return response.data;
  },

  // Get signature info
  getSignatureInfo: async () => {
    const response = await API.get("/admin/company/signature-info");
    return response.data;
  },

  // Reset company to default
  resetCompany: async () => {
    const response = await API.post("/admin/company/reset");
    return response.data;
  },
};

// Property Management (Admin)
export const propertyAPI = {
  // Get all properties for admin (including sold/rented)
  getAllPropertiesAdmin: async (params = {}) => {
    const response = await API.get("/admin/properties", { params });
    return response.data;
  },

  // Get single property for admin
  getPropertyByIdAdmin: async (id) => {
    const response = await API.get(`/admin/properties/${id}`);
    return response.data;
  },

  // Create new property with images
  createProperty: async (formData) => {
    const response = await API.post("/admin/properties", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  // Update property (text fields only)
  updateProperty: async (id, data) => {
    const response = await API.put(`/admin/properties/${id}`, data);
    return response.data;
  },

  // Add more images to existing property
  addImages: async (id, imageFiles) => {
    const formData = new FormData();
    imageFiles.forEach((file) => {
      formData.append("images", file);
    });
    const response = await API.post(
      `/admin/properties/${id}/images`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      },
    );
    return response.data;
  },

  // Delete a single image from property
  deleteImage: async (propertyId, imageIndex) => {
    const response = await API.delete(
      `/admin/properties/${propertyId}/images/${imageIndex}`,
    );
    return response.data;
  },

  // Update thumbnail (set which image is the thumbnail)
  updateThumbnail: async (propertyId, imageIndex) => {
    const response = await API.put(
      `/admin/properties/${propertyId}/thumbnail/${imageIndex}`,
    );
    return response.data;
  },

  // Reorder images
  reorderImages: async (propertyId, newOrder) => {
    const response = await API.put(
      `/admin/properties/${propertyId}/images/reorder`,
      { newOrder },
    );
    return response.data;
  },

  // Update property status
  updateStatus: async (id, status) => {
    const response = await API.patch(`/admin/properties/${id}/status`, {
      status,
    });
    return response.data;
  },

  // Toggle featured status
  toggleFeatured: async (id) => {
    const response = await API.patch(`/admin/properties/${id}/featured`);
    return response.data;
  },

  // Delete property (with all images)
  deleteProperty: async (id) => {
    const response = await API.delete(`/admin/properties/${id}`);
    return response.data;
  },

  // Bulk delete properties
  bulkDeleteProperties: async (propertyIds) => {
    const response = await API.post("/admin/properties/bulk-delete", {
      propertyIds,
    });
    return response.data;
  },

  // Bulk update properties
  bulkUpdateProperties: async (propertyIds, updateData) => {
    const response = await API.patch("/admin/properties/bulk-update", {
      propertyIds,
      updateData,
    });
    return response.data;
  },

  // Export properties to CSV
  exportPropertiesCSV: async () => {
    const response = await API.get("/admin/properties/export/csv", {
      responseType: "blob",
    });
    return response.data;
  },
};

// Public Property API (for frontend display)
export const publicPropertyAPI = {
  // Get all properties with filters
  getProperties: async (params = {}) => {
    const response = await API.get("/properties", { params });
    return response.data;
  },

  // Get featured properties
  getFeaturedProperties: async () => {
    const response = await API.get("/properties/featured");
    return response.data;
  },

  // Get properties by type (buy/rent/land)
  getPropertiesByType: async (type, params = {}) => {
    // Build query string
    const queryParams = new URLSearchParams();
    Object.keys(params).forEach((key) => {
      if (
        params[key] !== undefined &&
        params[key] !== null &&
        params[key] !== ""
      ) {
        queryParams.append(key, params[key]);
      }
    });

    const url = `/properties/type/${type}${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
    console.log("📡 API URL:", url);

    const response = await API.get(url);
    return response.data;
  },

  // Search properties
  searchProperties: async (searchParams) => {
    const response = await API.get("/properties/search", {
      params: searchParams,
    });
    return response.data;
  },

  // Get single property by ID
  getPropertyById: async (id) => {
    const response = await API.get(`/properties/${id}`);
    return response.data;
  },

  // Get similar properties
  getSimilarProperties: async (id) => {
    const response = await API.get(`/properties/${id}/similar`);
    return response.data;
  },
};

// AUTH for client login

export const authUserAPI = {
  register: async (userData) => {
    try {
      const response = await usersAPI.post("/users/register", userData);
      console.log("Register API - Full response:", response);
      console.log("Register API - Response data:", response.data);
      return response.data; // Return the data property
    } catch (error) {
      console.log("Register API - Error caught");
      console.log("Register API - Error response:", error.response);
      console.log("Register API - Error response data:", error.response?.data);
      console.log("Register API - Error message:", error.message);
      // Throw the error so it can be caught in the component
      throw error;
    }
  },

  login: async (email, password, rememberMe) => {
    try {
      const response = await usersAPI.post("/users/login", { 
        email, 
        password,
        rememberMe // ← Pass to backend
      });
      console.log("Login API - Full response:", response);
      console.log("Login API - Status:", response.status);
      console.log("Login API - Data:", response.data);
      return response;
    } catch (error) {
      console.log("Login API - Error:", error.response?.data);
      throw error;
    }
  },

  verifyEmail: async (token) => {
    const response = await API.get(`/users/verify-email/${token}`);
    return response.data;
  },

    // ✅ NEW: Verify email with token (Advanced)
  verifyEmailAdvanced: async (token) => {
    const response = await usersAPI.get(`/users/verify-email-advanced/${token}`);
    return response;
  },

  // ✅ NEW: Resend verification email (Advanced)
  resendVerificationEmail: async (data) => {
    const response = await usersAPI.post("/users/resend-verification-email", data);
    return response;
  },

  // ✅ NEW: Change verification email (Advanced)
  changeVerificationEmail: async (data) => {
    const response = await usersAPI.post("/users/change-verification-email", data);
    return response;
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  },

  getCurrentUser: async () => {
    const response = await usersAPI.get("/users/me");
    return response.data;
  },

  forgotPassword: async (data) => {
    // ✅ Accept data object with email property
    const response = await usersAPI.post("/users/forgot-password", data);
    return response.data;
  },

  resetPassword: async (token, data) => {
    // ✅ data should be { password: 'newpassword' }
    const response = await usersAPI.post(`/users/reset-password/${token}`, data);
    return response.data;
  },

  changePassword: async (currentPassword, newPassword) => {
    const response = await usersAPI.post("/users/change-password", {
      currentPassword,
      newPassword,
    });
    return response.data;
  },

  // Get user's reference letters
  getReferenceLetters: async () => {
    try {
      const response = await usersAPI.get("/users/reference-letters");
      console.log("Get Reference Letters - Response:", response);
      return response;
    } catch (error) {
      console.error("Error fetching reference letters:", error);
      throw error;
    }
  },

  downloadReferenceLetter: async (letterId) => {
    try {
      const token = localStorage.getItem("token");

      // Use fetch directly to handle blob response
      const response = await fetch(
        `${BASE_URL}/users/reference-letters/${encodeURIComponent(letterId)}/download-proxy`,
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
