// server/src/middleware/agentValidation.js
const Agent = require("../models/Agent.model");
const { AppError } = require("./errorMiddleware");

const validateAgentEmail = async (req, res, next) => {
  try {
    const { email } = req.body;
    const agentId = req.params.id;

    console.log("🔍 Validating email:", email);
    console.log("📝 Agent ID (for update):", agentId);

    // If no email in request body, skip validation (email not being updated)
    if (!email) {
      console.log("✅ No email in request - skipping validation");
      return next();
    }

    // Validate email format
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      console.log("❌ Invalid email format");
      throw new AppError(
        "Please provide a valid email address",
        400,
        "ValidationError",
      );
    }

    // Check if email already exists in database
    const existingAgent = await Agent.findOne({ email });

    if (agentId) {
      // UPDATE mode - we have an agent ID
      console.log("🔄 UPDATE MODE: Checking if email belongs to another agent");

      // If the email belongs to the SAME agent (self), it's OK
      if (existingAgent && existingAgent._id.toString() === agentId) {
        console.log("✅ Email belongs to the same agent - OK");
        return next();
      }

      // If the email belongs to a DIFFERENT agent, it's an error
      if (existingAgent) {
        console.log(`❌ Email belongs to another agent: ${existingAgent._id}`);
        throw new AppError(
          "Agent with this email already exists",
          400,
          "DuplicateError",
        );
      }

      // Email not found in database - OK to use
      console.log("✅ Email is available");
      return next();
    } else {
      // CREATE mode - check if email exists at all
      console.log("✨ CREATE MODE: Checking if email exists");

      if (existingAgent) {
        console.log("❌ Email already exists in database");
        throw new AppError(
          "Agent with this email already exists",
          400,
          "DuplicateError",
        );
      }

      console.log("✅ Email is available for new agent");
      return next();
    }
  } catch (error) {
    console.log("❌ Email validation failed:", error.message);
    next(error);
  }
};

module.exports = { validateAgentEmail };
