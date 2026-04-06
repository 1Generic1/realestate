const mongoose = require("mongoose");

// Helper validation functions
const validatePhone = (phone) => {
  // Allows: +2348012345678, 08012345678, +234 801 234 5678, etc.
  return /^\+?[\d\s-]{10,20}$/.test(phone);
};

const validateEmail = (email) => {
  return /^\S+@\S+\.\S+$/.test(email);
};

// ENHANCED hours validator that checks actual time values
const validateBusinessHours = (timeString) => {
  if (timeString === "Closed") return true;

  // Strict regex for time format
  const pattern = /^(\d{1,2}):(\d{2}) (AM|PM) - (\d{1,2}):(\d{2}) (AM|PM)$/;
  const match = timeString.match(pattern);

  if (!match) return false;

  // Extract hours and minutes
  const startHour = parseInt(match[1]);
  const startMinute = parseInt(match[2]);
  const startPeriod = match[3];
  const endHour = parseInt(match[4]);
  const endMinute = parseInt(match[5]);
  const endPeriod = match[6];

  // Convert to 24-hour format for validation
  const convertTo24Hour = (hour, period) => {
    if (period === "AM") return hour === 12 ? 0 : hour;
    return hour === 12 ? 12 : hour + 12;
  };

  const start24 = convertTo24Hour(startHour, startPeriod);
  const end24 = convertTo24Hour(endHour, endPeriod);

  // Validation rules:
  // 1. Hours must be 1-12
  if (startHour < 1 || startHour > 12) return false;
  if (endHour < 1 || endHour > 12) return false;

  // 2. Minutes must be 00-59
  if (startMinute < 0 || startMinute > 59) return false;
  if (endMinute < 0 || endMinute > 59) return false;

  // 3. End time must be after start time
  if (end24 < start24) return false;
  if (end24 === start24 && endMinute <= startMinute) return false;

  // 4. Special: 12:00 AM is valid, 13:00 AM is not
  if (startPeriod === "AM" && startHour > 12) return false;
  if (endPeriod === "AM" && endHour > 12) return false;

  return true;
};

const validateUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

const validateSocialUrl = (url, platform) => {
  if (!url) return true; // Empty URLs are allowed (optional fields)
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.includes(platform);
  } catch {
    return false;
  }
};

const companySchema = new mongoose.Schema(
  {
    // Contact Information
    phone: {
      primary: {
        type: String,
        default: "+234 801 234 5678",
        //required: [true, "Primary phone number is required"],
        validate: {
          validator: validatePhone,
          message: (props) =>
            `${props.value} is not a valid phone number! Use format: +234 801 234 5678`,
        },
        trim: true,
      },
      secondary: {
        type: String,
        default: "",
        validate: {
          validator: (v) => !v || validatePhone(v),
          message: (props) => `${props.value} is not a valid phone number!`,
        },
        trim: true,
      },
      whatsapp: {
        type: String,
        default: "+234 803 456 7890",
        validate: {
          validator: validatePhone,
          message: (props) => `${props.value} is not a valid WhatsApp number!`,
        },
        trim: true,
      },
    },

    email: {
      general: {
        type: String,
        default: "info@tayesproperty.com",
        required: [true, "General email is required"],
        validate: {
          validator: validateEmail,
          message: (props) => `${props.value} is not a valid email address!`,
        },
        lowercase: true,
        trim: true,
      },
      support: {
        type: String,
        default: "support@tayesproperty.com",
        validate: {
          validator: validateEmail,
          message: (props) => `${props.value} is not a valid email address!`,
        },
        lowercase: true,
        trim: true,
      },
      sales: {
        type: String,
        default: "sales@tayesproperty.com",
        validate: {
          validator: validateEmail,
          message: (props) => `${props.value} is not a valid email address!`,
        },
        lowercase: true,
        trim: true,
      },
      rentals: {
        type: String,
        default: "rentals@tayesproperty.com",
        validate: {
          validator: validateEmail,
          message: (props) => `${props.value} is not a valid email address!`,
        },
        lowercase: true,
        trim: true,
      },
    },

    address: {
      street: {
        type: String,
        default: "123 Business District",
        required: [true, "Street address is required"],
        minlength: [5, "Street address must be at least 5 characters"],
        maxlength: [100, "Street address cannot exceed 100 characters"],
        trim: true,
      },
      city: {
        type: String,
        default: "Lagos",
        required: [true, "City is required"],
        minlength: [2, "City name must be at least 2 characters"],
        trim: true,
      },
      state: {
        type: String,
        default: "Lagos State",
        required: [true, "State is required"],
        trim: true,
      },
      country: {
        type: String,
        default: "Nigeria",
        required: [true, "Country is required"],
        trim: true,
      },
      postalCode: {
        type: String,
        default: "100001",
        validate: {
          validator: (v) => /^\d{5,6}$/.test(v),
          message: "Postal code must be 5-6 digits",
        },
        trim: true,
      },
      mapLink: {
        type: String,
        default: "https://maps.google.com/?q=Lagos,Nigeria",
        validate: {
          validator: (v) => !v || validateUrl(v),
          message: "Map link must be a valid URL",
        },
        trim: true,
      },
    },

    // UPDATED: Hours with enhanced validation
    hours: {
      monday: {
        type: String,
        default: "8:00 AM - 6:00 PM",
        validate: {
          validator: validateBusinessHours,
          message:
            'Monday hours must be format "9:00 AM - 5:00 PM", "Closed", or a valid time range',
        },
      },
      tuesday: {
        type: String,
        default: "8:00 AM - 6:00 PM",
        validate: {
          validator: validateBusinessHours,
          message:
            'Tuesday hours must be format "9:00 AM - 5:00 PM", "Closed", or a valid time range',
        },
      },
      wednesday: {
        type: String,
        default: "8:00 AM - 6:00 PM",
        validate: {
          validator: validateBusinessHours,
          message:
            'Wednesday hours must be format "9:00 AM - 5:00 PM", "Closed", or a valid time range',
        },
      },
      thursday: {
        type: String,
        default: "8:00 AM - 6:00 PM",
        validate: {
          validator: validateBusinessHours,
          message:
            'Thursday hours must be format "9:00 AM - 5:00 PM", "Closed", or a valid time range',
        },
      },
      friday: {
        type: String,
        default: "8:00 AM - 6:00 PM",
        validate: {
          validator: validateBusinessHours,
          message:
            'Friday hours must be format "9:00 AM - 5:00 PM", "Closed", or a valid time range',
        },
      },
      saturday: {
        type: String,
        default: "9:00 AM - 2:00 PM",
        validate: {
          validator: validateBusinessHours,
          message:
            'Saturday hours must be format "9:00 AM - 5:00 PM", "Closed", or a valid time range',
        },
      },
      sunday: {
        type: String,
        default: "Closed",
        validate: {
          validator: function (v) {
            return v === "Closed" || validateBusinessHours(v);
          },
          message: 'Sunday must be "Closed" or valid business hours',
        },
      },
      notes: {
        type: String,
        default: "Public holidays may vary",
        maxlength: [200, "Notes cannot exceed 200 characters"],
      },
    },

    social: {
      facebook: {
        type: String,
        default: "https://facebook.com/tayesproperty",
        validate: {
          validator: (v) => !v || validateSocialUrl(v, "facebook.com"),
          message: "Must be a valid Facebook URL",
        },
        trim: true,
      },
      twitter: {
        type: String,
        default: "https://twitter.com/tayesproperty",
        validate: {
          validator: (v) =>
            !v ||
            validateSocialUrl(v, "twitter.com") ||
            validateSocialUrl(v, "x.com"),
          message: "Must be a valid Twitter/X URL",
        },
        trim: true,
      },
      instagram: {
        type: String,
        default: "https://instagram.com/tayesproperty",
        validate: {
          validator: (v) => !v || validateSocialUrl(v, "instagram.com"),
          message: "Must be a valid Instagram URL",
        },
        trim: true,
      },
      linkedin: {
        type: String,
        default: "https://linkedin.com/company/tayesproperty",
        validate: {
          validator: (v) => !v || validateSocialUrl(v, "linkedin.com"),
          message: "Must be a valid LinkedIn URL",
        },
        trim: true,
      },
    },
    signature: {
      type: String, // URL to signature image
      default: "",
    },
    signaturePublicId: {
      type: String,
      default: "",
    },
    signatoryName: {
      type: String,
      default: "",
      trim: true,
    },
    signatoryTitle: {
      type: String,
      default: "",
      trim: true,
    },

    // ===== REFERENCE LETTER TEMPLATES =====
    referenceTemplates: {
      visa: {
        recipientTitle: {
          type: String,
          default: "TO THE EMBASSY/VISA OFFICER",
        },
        letterTitle: { type: String, default: "LETTER OF REFERENCE" },
        salutation: { type: String, default: "Dear Visa Officer" },
      },
      employment: {
        recipientTitle: {
          type: String,
          default: "TO THE HUMAN RESOURCES MANAGER",
        },
        letterTitle: {
          type: String,
          default: "LETTER OF EMPLOYMENT REFERENCE",
        },
        salutation: { type: String, default: "Dear Hiring Manager" },
      },
      bank: {
        recipientTitle: { type: String, default: "TO THE BANK MANAGER" },
        letterTitle: { type: String, default: "BANK REFERENCE LETTER" },
        salutation: { type: String, default: "Dear Bank Manager" },
      },
      general: {
        recipientTitle: { type: String, default: "TO WHOM IT MAY CONCERN" },
        letterTitle: { type: String, default: "CERTIFICATE OF GOOD STANDING" },
        salutation: { type: String, default: "To Whom It May Concern" },
      },
      custom: {
        type: Map,
        of: new mongoose.Schema({
          recipientTitle: { type: String, required: true },
          letterTitle: { type: String, required: true },
          salutation: { type: String, required: true },
          createdAt: { type: Date, default: Date.now },
          updatedAt: { type: Date, default: Date.now },
        }),
        default: {},
      },
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Company", companySchema);
