const express = require("express");
const router = express.Router();

const controller = require("../controllers/application.controller");

const { authenticate } = require("../middleware/auth.middleware");
const { authorizeRoles } = require("../middleware/role.middleware");

router.put(
  "/:id/status",
  authenticate,
  authorizeRoles("COMPANY"),
  controller.updateStatus
);

router.get(
  "/me",
  authenticate,
  authorizeRoles("STUDENT"),
  controller.getMyApplications
);

module.exports = router;