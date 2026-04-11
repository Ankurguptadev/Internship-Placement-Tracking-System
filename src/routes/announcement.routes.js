const express = require("express");
const router = express.Router();

const controller = require("../controllers/announcement.controller");

const { authenticate } = require("../middleware/auth.middleware");
const { authorizeRoles } = require("../middleware/role.middleware");
const { validate } = require("../middleware/validate.middleware");

const {
  createAnnouncementSchema,
} = require("../validators/announcement.validator");

router.post(
  "/",
  authenticate,
  authorizeRoles("ADMIN"),
  validate(createAnnouncementSchema),
  controller.createAnnouncement,
);

router.get(
  "/",
  authenticate,
  authorizeRoles("STUDENT"),
  controller.getAnnouncements,
);

router.post(
  "/:id/read",
  authenticate,
  authorizeRoles("STUDENT"),
  controller.markAsRead
);

module.exports = router;
