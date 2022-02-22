const express = require("express");
const { check } = require("express-validator");
const { validationResult } = require("express-validator");

const router = express.Router();

let seed_data = [
  {
    id: "place2",
    imgUrl:
      "https://qul.imgix.net/4d8a0964-da2a-4ec9-b0a0-95a577d2a1d6/552197_sld.jpg?auto=format&w=1800",
    name: "pizza pizza",
    foodOrdered: "Egg-Ham-Cheese",
    comments: "taste like socks",
    revisit: "no",
    address: "road road Avenue 3",
    creatorID: "u1",
    gcoordinates: {
      lat: 1.2907,
      lng: 103.852,
    },
  },
];

//GET ROUTES

//route to get location
router.get("/:locationID", (req, res) => {
  const locationID = req.params.locationID;
  const location = seed_data.find((loc) => {
    return loc.id === locationID;
  });
  res.json({ location: location });
});

//all location for each userID
router.get("/user/:userID", (req, res) => {
  const userID = req.params.userID;
  const locations = seed_data.filter((loc) => {
    return loc.creatorID === userID;
  });
  res.json({ locations: locations });
});

//POST ROUTES

//new location entry
router.post(
  "/",
  [check("name").not().isEmpty()],
  [check("foodOrdered").not().isEmpty()],
  [check("revisit").not().isEmpty()],
  [check("address").not().isEmpty()],
  (req, res) => {
    const validationErr = validationResult(req);
    if (!validationErr.isEmpty()) {
      console.log(validationErr, "error: invalid input");
      res.status(422);
    }
    const {
      name,
      foodOrdered,
      comments,
      revisit,
      address,
      creatorID,
      gcoordinates,
    } = req.body;
    const createdLocation = {
      name,
      foodOrdered,
      comments,
      revisit,
      address,
      creatorID,
      location: gcoordinates,
    };

    seed_data.push(createdLocation);

    res.status(201).json({ location: createdLocation });
  }
);

//PUT Routes
//update past locations
router.put(
  "/:locationID",
  [check("name").not().isEmpty()],
  [check("foodOrdered").not().isEmpty()],
  [check("revisit").not().isEmpty()],
  [check("address").not().isEmpty()],
  (req, res) => {
    const validationErr = validationResult(req);
    if (!validationErr.isEmpty()) {
      console.log(validationErr, "error: invalid input");
      res.status(422);
    }
    const { name, foodOrdered, comments, revisit, address, gcoordinates } =
      req.body;
    const locationID = req.params.locationID;

    const updateLocation = {
      ...seed_data.find((loc) => loc.id === locationID),
    };
    const locationIndex = seed_data.find((loc) => loc.id === locationID);
    updateLocation.name = name;
    updateLocation.foodOrdered = foodOrdered;
    updateLocation.comments = comments;
    updateLocation.revisit = revisit;
    updateLocation.address = address;
    updateLocation.gcoordinates = gcoordinates;

    seed_data[locationIndex] = updateLocation;

    res.status(200).json({ location: updateLocation });
  }
);

//DELETE
router.delete("/:locationID", (req, res) => {
  const locationID = req.params.locationID;
  if (seed_data.find(loc => loc.id=== locationID)) {
    console.log('error msg')
  }
  seed_data = seed_data.filter((loc) => loc.id !== locationID);
  res.status(200).json({ message: "location deleted!" });
});

module.exports = router;
