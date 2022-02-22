const express = require("express");
const { check } = require("express-validator");
const { validationResult } = require("express-validator");
const HttpError = require("../models/error-handler");
const User = require("../models/user");

const router = express.Router();

const seed_data = [
  {
    id: "u1",
    name: "john smith",
    userName: "jellyboi",
    img: "https://avataaars.io/?avatarStyle=Circle&topType=LongHairStraight&accessoriesType=Blank&hairColor=BrownDark&facialHairType=Blank&clotheType=BlazerShirt&eyeType=Default&eyebrowType=Default&mouthType=Default&skinColor=Light",
    email: "user@user.com",
    password: "password",
    locations: 4,
  },
];

//GET ROUTES
//get all user
router.get("/all", (req, res) => {
  res.json({ users: seed_data });
});

//POST ROUTES
//create new user & sign in
router.post(
  "/signup",
  [check("username").not().isEmpty()],
  [check("email").not().isEmpty()],
  [check("email").normalizeEmail().isEmail()],
  [check("password").not().isEmpty()],
  async (req, res, next) => {
    const validationErr = validationResult(req);
    if (!validationErr.isEmpty()) {
      return next(new HttpError('Invalid inputs passed, please check'))
    }

    const { email, username, password, locations } = req.body;

    let userExists
    try {
      userExists = await User.findOne({ email: email });
    } catch (err) {
      const error = new HttpError('Failed to sign up, please try again', 500)
      return next(error)
    }

    if (userExists) {
      const error = new HttpError('User already exists. Please login.', 422)
      return next(error)
    };

    const newUser = new User({
      email: email, 
      password: password, 
      username: username,
      img: 'https://avataaars.io/?avatarStyle=Transparent&topType=WinterHat4&accessoriesType=Blank&hatColor=Red&facialHairType=MoustacheMagnum&facialHairColor=Platinum&clotheType=ShirtVNeck&clotheColor=Blue01&eyeType=Side&eyebrowType=UpDownNatural&mouthType=Concerned&skinColor=Brown', 
      locations: locations
    });

    try {
      await newUser.save(); 
    } catch(err) {
      const error = new HttpError(
        'Failed to create user, please try again', 500);
      return next(error)
    }
    res.status(201).json({ user: newUser.toObject({getters:true}) });
  }
);

//login existing user
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  const userFound = seed_data.find((u) => u.email === email);
  if (!userFound || userFound.password !== password) {
    throw new HttpError("Username or Password is wrong", 401);
  }

  res.json({ message: "Logged In" });
});

module.exports = router;
