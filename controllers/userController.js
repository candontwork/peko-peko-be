const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { check } = require("express-validator");
const { validationResult } = require("express-validator");
const HttpError = require("../models/error-handler");
const User = require("../models/user");
const checkAuth = require("./middleware/check-auth");

const router = express.Router();

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


app.use(checkAuth);

//POST ROUTES   -----------------------------------------------------------
//create new user & sign in
router.post(
  "/signup",
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

    const newUser = new User({
      email: email,
      password: hashedPassword,
      username: username,
      img: "https://avataaars.io/?avatarStyle=Transparent&topType=WinterHat4&accessoriesType=Blank&hatColor=Red&facialHairType=MoustacheMagnum&facialHairColor=Platinum&clotheType=ShirtVNeck&clotheColor=Blue01&eyeType=Side&eyebrowType=UpDownNatural&mouthType=Concerned&skinColor=Brown",
      locations: [],
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

    let token;
    try {
      token = jwt.sign(
        { userId: newUser.id, email: newUser.email },
        "supersecret_DNS",
        { expiresIn: "1h" }
      );
    } catch (err) {
      const error = new HttpError(
        'Sign up failed, try again later', 500);
        return next(error)
    }

    res.status(201).json({ userId: newUser.id, email: newUser.email, token: token });
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

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, userFound.password);
  } catch (err) {
    const error = new HttpError(
      "Could not login, please check your login details.",
      500
    );
    return next(error);
  }

  if (!isValidPassword) {
    const error = new HttpError("Login denied, invalid login details.", 401);
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      { userId: userFound.id, email: userFound.email },
      "supersecret_DNS",
      { expiresIn: "1h" }
    );
  } catch (err) {
    const error = new HttpError(
      'Logging in failed, try again later', 500);
      return next(error)
  }

  res.json({
    userId: userFound.id, 
    email: userFound.email,
    token: token
    // message: "Logged in!",
    // user: userFound.toObject({ getters: true }),
  });
});

module.exports = router;
