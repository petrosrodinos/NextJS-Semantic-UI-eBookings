const express = require("express");
const { check } = require("express-validator");
const usersController = require("../controllers/users");

const router = express.Router();

router.post(
  "/register",
  [
    check("fullname").not().isEmpty().isLength({ min: 6, max: 20 }),
    check("phone").not().isEmpty().isNumeric({ min: 10, max: 15 }),
    check("city").not().isEmpty().isLength({ min: 4, max: 20 }),
    check("area").not().isEmpty().isLength({ min: 4, max: 20 }),
    check("email").normalizeEmail().isEmail(),
    check("password").isLength({ min: 6 }),
  ],
  usersController.signup
);

router.post("/login", usersController.login);

module.exports = router;
