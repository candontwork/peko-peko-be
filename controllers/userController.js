const express = require("express");

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
router.get("/all", (req, res) => {
  const { name, email, password } = req.body;

  const newUser = {
    id,
    name,
    email,
    password,
  };

  seed_data.push(newUser);
  res.status(201).json({ user: newUser });
});

//login existing user
router.get("/all", (req, res) => {});

module.exports = router;
