const express = require("express");
const router = express.Router();

const offerController = require("../controllers/offer.controller");

const { authenticate } = require("../middleware/auth.middleware");
const { authorizeRoles } = require("../middleware/role.middleware");
const { validate } = require("../middleware/validate.middleware");

const {
  createOfferSchema,
  updateOfferSchema,
} = require("../validators/offer.validator");
const { route } = require("./drive.routes");

router.post("/", authenticate, authorizeRoles("COMPANY"), validate(createOfferSchema), offerController.createOffer);

router.get("/students/me", authenticate, authorizeRoles("STUDENT"), offerController.getStudentOffers);

router.put("/:offerID", authenticate, authorizeRoles("STUDENT"), validate(updateOfferSchema), offerController.updateOfferStatus);

module.exports = router;