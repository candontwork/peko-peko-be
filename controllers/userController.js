const express = require("express");

const router = express.Router();

const seed_data = [
  {
    id: "u1",
    name: "john smith",
    img: "https://avataaars.io/?avatarStyle=Circle&topType=LongHairStraight&accessoriesType=Blank&hairColor=BrownDark&facialHairType=Blank&clotheType=BlazerShirt&eyeType=Default&eyebrowType=Default&mouthType=Default&skinColor=Light",
    locations: 4,
  },
];

router.get('/user/:userID', (req, res) => {
    const userID = req.params.userID;
    const user = seed_data.find(u => {
        return u.id === userID
    })
    res.json({user: user})
})

module.exports = router;