const express = require("express");
const router = express.Router();

const companyController = require("../controllers/company.controller");

const { authenticate } = require("../middleware/auth.middleware");
const { authorizeRoles } = require("../middleware/role.middleware");
const { validate } = require("../middleware/validate.middleware");

const { updateCompanySchema } = require("../validators/company.validator");

router.get(
  "/me",
  authenticate,
  authorizeRoles("COMPANY"),
  companyController.getProfile,
);
router.put(
  "/me",
  authenticate,
  authorizeRoles("COMPANY"),
  validate(updateCompanySchema),
  companyController.updateProfile,
);

module.exports = router;