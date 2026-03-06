const express = require("express");
const router = express.Router();

const driveController = require("../controllers/drive.controller");

const { authenticate } = require("../middleware/auth.middleware");
const { authorizeRoles } = require("../middleware/role.middleware");

router.get(
  "/",
  authenticate,
  authorizeRoles("STUDENT"),
  driveController.getDrives,
);

router.post(
  "/:driveId/applications",
  authenticate,
  authorizeRoles("STUDENT"),
  driveController.applyToDrive,
);

module.exports = router;
