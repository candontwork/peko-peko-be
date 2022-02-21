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
router.post("/signup", (req, res) => {
  const { name, email, password } = req.body;

  const newUser = {
    id: '12312412',
    name,
    email,
    password,
  };

  seed_data.push(newUser);
  res.status(201).json({ user: newUser });
});


//login existing user
router.post("/login", (req, res) => {
  const {email, password} = req.body;

  const userFound = seed_data.find(u => ugit ad.email === email);
  if (!userFound || userFound.password !== password) {
    console.log('password and user dont match')
  }

  res.json({message: 'Logged In'})
});

module.exports = router;
