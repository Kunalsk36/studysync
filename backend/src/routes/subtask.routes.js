const { Router } = require("express");
const subtaskController = require("../controllers/subtask.controller");
const validate = require("../middleware/validate");
const { createSchema, updateSchema } = require("../validations/subtask.validation");

const router = Router({ mergeParams: true });

router.post("/", validate(createSchema), subtaskController.create);
router.get("/", subtaskController.getAll);
router.get("/:id", subtaskController.getById);
router.put("/:id", validate(updateSchema), subtaskController.update);
router.delete("/:id", subtaskController.remove);
router.patch("/:id/toggle-complete", subtaskController.toggleComplete);

module.exports = router;
