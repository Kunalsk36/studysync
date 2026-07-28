const { Router } = require("express");
const taskController = require("../controllers/task.controller");
const authenticate = require("../middleware/authenticate");
const validate = require("../middleware/validate");
const { createSchema, updateSchema, querySchema } = require("../validations/task.validation");

const router = Router();

router.use(authenticate); // Protect all routes

router.post("/", validate(createSchema), taskController.create);
router.get("/", validate(querySchema, "query"), taskController.getAll);
router.get("/:id", taskController.getById);
router.put("/:id", validate(updateSchema), taskController.update);
router.delete("/:id", taskController.remove);
router.patch("/:id/toggle-complete", taskController.toggleComplete);

module.exports = router;
