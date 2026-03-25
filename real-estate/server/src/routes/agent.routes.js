const express = require("express");
const router = express.Router();
const { adminAuth } = require("../middleware/auth.middleware");
const { uploadAgentImage } = require("../config/cloudinary");
const agentController = require("../controllers/agent.controller");

// ==================== PUBLIC ROUTES ====================
router.get("/agents", agentController.getAgents);
router.get("/agents/featured", agentController.getFeaturedAgents);
router.get("/agents/top-rated", agentController.getTopRatedAgents);
router.get("/agents/search", agentController.searchAgents);
router.get(
  "/agents/specialty/:specialty",
  agentController.getAgentsBySpecialty,
);
router.get("/agents/:slug", agentController.getAgentBySlug);

// ==================== ADMIN ROUTES ====================
router.use(adminAuth);

// Agent CRUD
router.get("/admin/agents", agentController.getAllAgentsAdmin);
router.get("/admin/agents/stats", agentController.getAgentStats);
router.get("/admin/agents/export/csv", agentController.exportAgentsCSV);
router.get("/admin/agents/:id", agentController.getAgentByIdAdmin);

// Create agent with image upload
router.post(
  "/admin/agents",
  uploadAgentImage.single("image"), // Field name "image" in form-data
  agentController.createAgent,
);

// Update agent with image upload
router.put(
  "/admin/agents/:id",
  uploadAgentImage.single("image"),
  agentController.updateAgent,
);

router.delete("/admin/agents/:id", agentController.deleteAgent);
router.post("/admin/agents/bulk-update", agentController.bulkUpdateAgents);

// Agent-Property relationship
router.post(
  "/admin/agents/:id/properties/:propertyId",
  agentController.addPropertyToAgent,
);
router.delete(
  "/admin/agents/:id/properties/:propertyId",
  agentController.removePropertyFromAgent,
);

// Testimonials
router.post(
  "/admin/agents/:id/testimonials",
  agentController.addTestimonialToAgent,
);

module.exports = router;
