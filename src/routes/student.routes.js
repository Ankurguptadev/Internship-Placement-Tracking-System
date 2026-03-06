const express = require("express");
const router = express.Router();

const studentController = require("../controllers/student.controller");
const { authenticate } = require("../middleware/auth.middleware");
const { authorizeRoles } = require("../middleware/role.middleware");
const { updateStudentSchema } = require("../validators/student.validator");
const { validate } = require("../middleware/validate.middleware");

router.get(
  "/me",
  authenticate,
  authorizeRoles("STUDENT"),
  studentController.getProfile,
);
router.put(
  "/me",
  authenticate,
  authorizeRoles("STUDENT"),
  validate(updateStudentSchema),
  studentController.updateProfile,
);

module.exports = router;
