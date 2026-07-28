const { Router } = require("express");
const categoryController = require("../controllers/category.controller");
const authenticate = require("../middleware/authenticate");
const validate = require("../middleware/validate");
const { createSchema, updateSchema } = require("../validations/category.validation");

const router = Router();

router.use(authenticate); // Protect all routes

router.post("/", validate(createSchema), categoryController.create);
router.get("/", categoryController.getAll);
router.get("/:id", categoryController.getById);
router.put("/:id", validate(updateSchema), categoryController.update);
router.delete("/:id", categoryController.remove);

module.exports = router;
