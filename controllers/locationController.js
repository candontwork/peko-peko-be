const express = require("express");
const { check } = require("express-validator");
const { validationResult } = require("express-validator");
const HttpError = require("../models/error-handler");

const router = express.Router();
const addressToCoord = require("../location");
const Location = require("../models/location");

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
router.get("/:locationID", async (req, res, next) => {
  const locationID = req.params.locationID;

  let location;
  try {
    location = await Location.findById(locationID);
  } catch (err) {
    const error = new HttpError("Error occured, location not found.", 500);
    return next(error);
  }
  if (!location) {
    const error = new HttpError("No location exists", 404);
    return next(error);
  }
  res.json({ location: location.toObject({ getters: true }) });
});

//all location for each userID
router.get("/user/:userID", async (req, res, next) => {
  const userID = req.params.userID;

  let locations;
  try {
    locations = await Location.find({ creator: userID });
  } catch (err) {
    const error = new HttpError(
      "An error occurred, please try again later.",
      500
    );
    return next(error);
  }
  if (!locations || locations.legnth === 0) {
    return next(new HttpError("No locations exist for this user.", 404));
  }
  res.json({
    locations: locations.map((loc) => loc.toObject({ getters: true })),
  });
});

//POST ROUTES

//new location entry
router.post("/", async (req, res, next) => {
  const { name, foodOrdered, comments, revisit, address, creatorID } = req.body;

  let gcoordinates;
  try {
    gcoordinates = await addressToCoord(address);
  } catch (err) {
    return next(err);
  }

  const createdLocation = new Location({
    name: name,
    foodOrdered: foodOrdered,
    address: address,
    revisit: revisit,
    coordinates: gcoordinates,
    img: "https://avataaars.io/?avatarStyle=Circle&topType=LongHairStraight&accessoriesType=Blank&hairColor=BrownDark&facialHairType=Blank&clotheType=BlazerShirt&eyeType=Default&eyebrowType=Default&mouthType=Default&skinColor=Light",
    creatorID,
  });

  try {
    await createdLocation.save();
  } catch (err) {
    const error = new HttpError(
      "Error occured when creating location, please try again",
      500
    );
    return next(error);
  }
  res.status(201).json({ location: createdLocation });
});

//PUT Routes
//update past locations
router.put(
  "/:locationID",
  [check("name").not().isEmpty()],
  [check("foodOrdered").not().isEmpty()],
  [check("revisit").not().isEmpty()],
  [check("address").not().isEmpty()],
  async (req, res, next) => {
    const validationErr = validationResult(req);
    if (!validationErr.isEmpty()) {
      throw new HttpError("Error in data entered, please check", 422);
    }

    const { name, foodOrdered, comments, revisit, address } = req.body;
    const locationID = req.params.locationID;

    let location;
    try {
      location = await Location.findById(locationID);
    } catch (err) {
      const error = new HttpError(
        "An error occured, unable to update location",
        500
      );
      return next(error);
    }

    location.name = name;
    location.foodOrdered = foodOrdered;
    location.comments = comments;
    location.revisit = revisit;
    location.address = address;

    try {
      await location.save();
    } catch (err) {
      const error = new HttpError(
        "An error occured, unable to update location",
        500
      );
      return next(error);
    }

    res.status(200).json({ location: location.toObject({ getters: true }) });
  }
);

//DELETE
router.delete("/:locationID", (req, res) => {
  const locationID = req.params.locationID;
  if (seed_data.find((loc) => loc.id === locationID)) {
    console.log("error msg");
  }
  seed_data = seed_data.filter((loc) => loc.id !== locationID);
  res.status(200).json({ message: "location deleted!" });
});

module.exports = router;
