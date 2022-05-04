const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const HttpError = require("../models/http-error");
const User = require("../models/user");

const signup = async (req, res, next) => {
  //const errors = validationResult(req);
  // if (!errors.isEmpty()) {
  //   return next(
  //     new HttpError("Invalid inputs passed, please check your data.", 422)
  //   );
  // }

  const { fullname, email, password, phone, city, area, business } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({
      $or: [
        {
          email: email,
        },
        { phone: phone },
      ],
    });
  } catch (err) {
    return res
      .status(400)
      .send({ message: "Signing up failed, please try again later. 1" });
  }

  if (existingUser) {
    return res.status(400).send({ message: "User already exits" });
  }

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    const error = new HttpError(
      "Could not create user, please try again.",
      500
    );
    return next(error);
  }

  const createdUser = new User({
    name: fullname,
    email,
    password: hashedPassword,
    phone,
    city,
    area,
    business: business ? { hasBusiness: true, businessId: null } : false,
  });

  try {
    await createdUser.save();
  } catch (err) {
    const error = new HttpError(err, 500);
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      { userId: createdUser.id, email: createdUser.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
  } catch (err) {
    return res
      .status(400)
      .send({ message: "Signing up failed, please try again later. 3" });
  }

  res.status(201).json({ userId: createdUser.id, token: token, business });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  let existingUser;

  try {
    existingUser = await User.findOne({
      $or: [
        {
          email: email,
        },
        { phone: email },
      ],
    });
  } catch (err) {
    return res
      .status(400)
      .send({ message: "Logging in failed, please try again later." });
  }

  if (!existingUser) {
    return res
      .status(400)
      .send({ message: "Invalid credentials, could not log you in." });
  }

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch (err) {
    return res
      .status(400)
      .send({ message: "Invalid credentials, could not log you in." });
  }

  if (!isValidPassword) {
    return res
      .status(400)
      .send({ message: "Invalid credentials, could not log you in." });
  }

  let token;
  try {
    if (existingUser.business.hasBusiness) {
      token = jwt.sign(
        {
          userId: existingUser.id,
          businessId: existingUser.business.businessId,
        },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
    } else {
      token = jwt.sign({ userId: existingUser.id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
    }
  } catch (err) {
    return res
      .status(400)
      .send({ message: "Logging in failed, please try again later.2" });
  }

  if (existingUser.business.hasBusiness) {
    return res.status(200).json({
      userId: existingUser.id,
      token: token,
      businessId: existingUser.business.businessId,
      hasBusiness: existingUser.business.hasBusiness,
    });
  }

  res.status(200).json({
    userId: existingUser.id,
    token: token,
    hasBusiness: existingUser.business.hasBusiness,
  });
};

exports.signup = signup;
exports.login = login;
