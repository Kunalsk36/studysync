const { Router } = require("express");
const notificationController = require("../controllers/notification.controller");
const authenticate = require("../middleware/authenticate");
const validate = require("../middleware/validate");
const { paramIdSchema } = require("../validations/notification.validation");

const router = Router();

router.use(authenticate);

router.get("/", notificationController.getAll);

// Static routes MUST go before dynamic routes to prevent parameter collision
router.patch("/read-all", notificationController.markAllAsRead);

router.patch("/:id/read", validate(paramIdSchema, "params"), notificationController.markAsRead);
router.delete("/:id", validate(paramIdSchema, "params"), notificationController.remove);

module.exports = router;
