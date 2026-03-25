import React, { createContext, useState, useEffect, useContext } from "react";
import { companyAPI } from "../services/api";

const CompanyContext = createContext();

export const useCompany = () => {
  const context = useContext(CompanyContext);
  if (!context) {
    throw new Error("useCompany must be used within a CompanyProvider");
  }
  return context;
};

export const CompanyProvider = ({ children }) => {
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);

  // Default company data to prevent crashes while loading
  const defaultCompany = {
    phone: {
      primary: "+234 801 234 5678",
      secondary: "",
      whatsapp: "+234 803 456 7890",
    },
    email: {
      general: "info@tayesproperty.com",
      support: "support@tayesproperty.com",
      sales: "sales@tayesproperty.com",
      rentals: "rentals@tayesproperty.com",
    },
    address: {
      street: "123 Business District",
      city: "Lagos",
      state: "Lagos State",
      country: "Nigeria",
      postalCode: "100001",
    },
    hours: {
      monday: "8:00 AM - 6:00 PM",
      tuesday: "8:00 AM - 6:00 PM",
      wednesday: "8:00 AM - 6:00 PM",
      thursday: "8:00 AM - 6:00 PM",
      friday: "8:00 AM - 6:00 PM",
      saturday: "9:00 AM - 2:00 PM",
      sunday: "Closed",
      notes: "Public holidays may vary",
    },
    social: {
      facebook: "https://facebook.com/tayesproperty",
      instagram: "https://instagram.com/tayesproperty",
      linkedin: "https://linkedin.com/company/tayesproperty",
    },
  };

  useEffect(() => {
    loadCompanyInfo();
  }, [retryCount]); // Retry when count changes

  // Clear timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const timeoutRef = React.useRef();

  const loadCompanyInfo = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await companyAPI.getCompanyInfo();

      // Merge with defaults to ensure all fields exist
      setCompany({
        ...defaultCompany,
        ...data,
        phone: { ...defaultCompany.phone, ...data?.phone },
        email: { ...defaultCompany.email, ...data?.email },
        address: { ...defaultCompany.address, ...data?.address },
        hours: { ...defaultCompany.hours, ...data?.hours },
        social: { ...defaultCompany.social, ...data?.social },
      });

      setError(null);
      setRetryCount(0); // Reset retry count on success
      setInitialLoadComplete(true);

      console.log("✅ Company data loaded successfully");
    } catch (err) {
      console.error("❌ Failed to load company info:", err);

      // Set error message
      if (err.response) {
        // Server responded with error
        setError(
          `Server error: ${err.response.status} - ${err.response.data?.message || "Unknown error"}`,
        );
      } else if (err.request) {
        // No response received
        setError("Cannot connect to server. Please check your connection.");
      } else {
        // Something else went wrong
        setError(err.message || "Failed to load company information");
      }

      // Auto-retry up to 3 times with exponential backoff
      if (retryCount < 3) {
        const delay = 2000 * Math.pow(2, retryCount); // 2s, 4s, 8s
        console.log(
          `🔄 Retrying in ${delay / 1000} seconds... (Attempt ${retryCount + 1}/3)`,
        );

        timeoutRef.current = setTimeout(() => {
          setRetryCount((prev) => prev + 1);
        }, delay);
      } else {
        console.log("❌ Max retries reached. Using default company data.");
        // Use default data after max retries
        setCompany(defaultCompany);
        setInitialLoadComplete(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const refreshCompanyInfo = async () => {
    console.log("🔄 Manually refreshing company data...");
    setRetryCount(0); // Reset retry count
    // Clear any pending timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    await loadCompanyInfo();
  };

  // Value object with everything components might need
  const value = {
    // Company data (merged with defaults)
    company: company || defaultCompany,

    // Loading states
    loading,
    initialLoadComplete,

    // Error handling
    error,
    hasError: !!error,

    // Refresh function
    refreshCompanyInfo,

    // Retry info
    retryCount,
    isRetrying: retryCount > 0 && retryCount <= 3,
    maxRetriesReached: retryCount >= 3 && !!error,

    // Utility getters for common fields
    getPhone: () => company?.phone?.primary || defaultCompany.phone.primary,
    getEmail: () => company?.email?.general || defaultCompany.email.general,
    getFullAddress: () => {
      const addr = company?.address || defaultCompany.address;
      return `${addr.street}, ${addr.city}, ${addr.state}, ${addr.country}`;
    },
    getBusinessHours: () => {
      const hours = company?.hours || defaultCompany.hours;
      return {
        weekdays: `${hours.monday} - ${hours.friday}`,
        saturday: hours.saturday,
        sunday: hours.sunday,
        full: hours,
      };
    },
  };

  return (
    <CompanyContext.Provider value={value}>{children}</CompanyContext.Provider>
  );
};
