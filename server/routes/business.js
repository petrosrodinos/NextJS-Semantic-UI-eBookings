const express = require("express");
const { check } = require("express-validator");
const businessController = require("../controllers/business");
const { protect } = require("../middleware/check-auth");

const router = express.Router();

router.post("/business", businessController.createBusiness);
router.get("/business", businessController.fetchBusinesses);
router.get("/business/:id", businessController.fetchBusiness);

module.exports = router;
