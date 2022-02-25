const express = require("express");
const { check } = require("express-validator");
const { validationResult } = require("express-validator");
const HttpError = require("../models/error-handler");
const User = require("../models/user");

const router = express.Router();
const fileUpload = require('../middleware/file-upload')

//GET ROUTES   -----------------------------------------------------------
//get all user
router.get("/all", async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, "-password");
  } catch (err) {
    const error = new HttpError(
      "Failed to find users, please try again later",
      500
    );
    return next(error);
  }
  res.json({ users: users.map((user) => user.toObject({ getters: true })) });
});

//POST ROUTES   -----------------------------------------------------------
//create new user & sign in
router.post(
  "/signup",
  fileUpload.single('image'),
  // [check("username").not().isEmpty()],
  // [check("email").not().isEmpty()],
  // [check("email").normalizeEmail().isEmail()],
  // [check("password").not().isEmpty()],
  async (req, res, next) => {
    // const validationErr = validationResult(req);
    // if (!validationErr.isEmpty()) {
    //   return next(new HttpError("Invalid inputs passed, please check"), 500);
    // }

    const { email, username, password } = req.body;

    let userExists;
    try {
      userExists = await User.findOne({ email: email });
    } catch (err) {
      const error = new HttpError("Failed to sign up, please try again", 500);
      return next(error);
    }

    if (userExists) {
      const error = new HttpError("User already exists. Please login.", 422);
      return next(error);
    }

    const newUser = new User({
      email: email,
      password: password,
      username: username,
      image: req.file.path,
      locations: []
    });

    try {
      await newUser.save();
    } catch (err) {
      const error = new HttpError(
        "Failed to create user, please try again",
        500
      );
      return next(error);
    }
    res.status(201).json({ user: newUser.toObject({ getters: true }) });
  }
);

//login existing user
router.post("/login", async (req, res, next) => {
  const { email, password } = req.body;

  let userFound;
  try {
    userFound = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError("Failed to login, please try again.", 500);
    return next(error);
  }

  if (!userFound) {
    const error = new HttpError("Email not found, please sign up", 401);
    return next(error);
  }

  if (userFound.password !== password) {
    const error = new HttpError("Email and password don't match", 401);
    return next(error);
  }

  res.json({
    message: 'Logged in!',
    user: userFound.toObject({ getters: true })
  });
})

module.exports = router;
