const express = require("express");
const { check } = require("express-validator");
const { validationResult } = require("express-validator");

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
  [check("name").not().isEmpty()],
  [check("email").not().isEmpty()],
  [check("email").normalizeEmail().isEmail()],
  [check("password").not().isEmpty()],
  [check("password").isLength({ min: 8 })],
  (req, res) => {
    const validationErr = validationResult(req);
    if (!validationErr.isEmpty()) {
      console.log(validationErr, "error: invalid input");
      res.status(422);
    }

    const { name, email, password } = req.body;

    const userExists = seed_data.find((u) => u.email === email);
    if (userExists) {
      console.log("user exists");
    }

    const newUser = {
      id: "12312412",
      name,
      email,
      password,
    };

    seed_data.push(newUser);
    res.status(201).json({ user: newUser });
  }
);

//login existing user
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  const userFound = seed_data.find((u) => u.email === email);
  if (!userFound || userFound.password !== password) {
    console.log("password and user dont match");
  }

  res.json({ message: "Logged In" });
});

module.exports = router;
