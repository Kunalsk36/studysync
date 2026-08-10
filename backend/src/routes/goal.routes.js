const express = require("express");
const router = express.Router();
const goalController = require("../controllers/goal.controller");
const manualStudyEntryController = require("../controllers/manualStudyEntry.controller");
const authenticate = require("../middleware/authenticate");
const validate = require("../middleware/validate");
const { createGoalSchema, updateGoalSchema } = require("../validations/goal.validation");
const { createManualStudyEntrySchema, updateManualStudyEntrySchema } = require("../validations/manualStudyEntry.validation");

// All goal routes require authentication
router.use(authenticate);

// --- Study Goals ---
router.get("/", goalController.getGoals);
router.post("/", validate(createGoalSchema), goalController.createGoal);
router.get("/:id", goalController.getGoalById);
router.put("/:id", validate(updateGoalSchema), goalController.updateGoal);
router.delete("/:id", goalController.deleteGoal);

// --- Manual Study Entries ---
router.get("/:goalId/manual-entries", manualStudyEntryController.getEntriesForGoal);
router.post(
  "/:goalId/manual-entries",
  validate(createManualStudyEntrySchema),
  manualStudyEntryController.createEntry
);
router.put(
  "/:goalId/manual-entries/:id",
  validate(updateManualStudyEntrySchema),
  manualStudyEntryController.updateEntry
);
router.delete("/:goalId/manual-entries/:id", manualStudyEntryController.deleteEntry);

module.exports = router;
