const express = require("express");

const router = express.Router();

const seed_data = [
  {
    id: "place2",
    imgUrl:
      "https://qul.imgix.net/4d8a0964-da2a-4ec9-b0a0-95a577d2a1d6/552197_sld.jpg?auto=format&w=1800",
    name: "pizza pizza",
    foodOrdered: "Egg-Ham-Cheese",
    comments: "taste like socks",
    revist: "no",
    address: "road road Avenue 3",
    creatorID: "u1",
    gcoordinates: {
      lat: 1.2907,
      lng: 103.852,
    },
  }
];

//GET ROUTES

//route to get location
router.get("/:locationID", (req, res) => {
  const locationID = req.params.locationID;
  const location = seed_data.find(loc => {
    return loc.id === locationID;
  });
  res.json({ location: location });
});

//location for each user
router.get("/user/:userID", (req, res) => {
    const userID = req.params.userID; 
    const location = seed_data.find(loc => {
        return loc.creatorID === userID
    })
    res.json({location: location})
});


module.exports = router;
