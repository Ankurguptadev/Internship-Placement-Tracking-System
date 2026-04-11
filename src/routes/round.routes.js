const express = require("express");
const router = express.Router();

const roundController = require("../controllers/round.controller");

const { authenticate } = require("../middleware/auth.middleware");
const { authorizeRoles } = require("../middleware/role.middleware");
const { validate } = require("../middleware/validate.middleware");

const { roundResultSchema } = require("../validators/round.validator");

router.post(
  "/:roundId/results",
  authenticate,
  authorizeRoles("COMPANY"),
  validate(roundResultSchema),
  roundController.addResult,
);

module.exports = router;
