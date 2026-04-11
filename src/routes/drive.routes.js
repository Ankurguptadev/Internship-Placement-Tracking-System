const express = require("express");
const router = express.Router();

const driveController = require("../controllers/drive.controller");

const { authenticate } = require("../middleware/auth.middleware");
const { authorizeRoles } = require("../middleware/role.middleware");
const { validate } = require("../middleware/validate.middleware");

const {
  createDriveSchema,
  updateDriveSchema,
} = require("../validators/drive.validator");

const { createRoundSchema } = require("../validators/round.validator");

// Student view

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

// ************************************************************//

// Company view

router.post(
  "/",
  authenticate,
  authorizeRoles("COMPANY"),
  validate(createDriveSchema),
  driveController.createDrive,
);
router.get(
  "/company",
  authenticate,
  authorizeRoles("COMPANY"),
  driveController.getCompanyDrives,
);
router.put(
  "/:driveId",
  authenticate,
  authorizeRoles("COMPANY"),
  validate(updateDriveSchema),
  driveController.updateDrive,
);

router.get(
  "/:driveID/applications",
  authenticate,
  authorizeRoles("COMPANY"),
  driveController.getApplicants,
);

router.post(
  "/:driveId/rounds",
  authenticate,
  authorizeRoles("COMPANY"),
  validate(createRoundSchema),
  driveController.createRound,
);

module.exports = router;
