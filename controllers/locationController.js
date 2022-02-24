const express = require("express");
const { check } = require("express-validator");
const { validationResult } = require("express-validator");
const mongoose = require('mongoose');

const checkAuth = require("./middleware/check-auth");
const router = express.Router();
const HttpError = require("../models/error-handler");
const addressToCoord = require("../location");
const Location = require("../models/location");
const User = require('../models/user')

//GET ROUTES   -----------------------------------------------------------
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
    // locations = await Location.find({ creator: userID });
    locations = await User.findById(userID).populate('locations')
  } catch (err) {
    const error = new HttpError(
      "An error occurred, please try again later.",
      500
    );
    return next(error);
  }
  if (!locations || locations.locationslength === 0) {
    return next(new HttpError("No locations exist for this user.", 404));
  }
  res.json({
    locations: locations.locations.map((loc) => loc.toObject({ getters: true })),
  });
});

app.use(checkAuth);

//POST ROUTES   -----------------------------------------------------------

//new location entry
router.post("/new", async (req, res, next) => {
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
    comments: comments,
    coordinates: gcoordinates,
    img: "https://qul.imgix.net/4d8a0964-da2a-4ec9-b0a0-95a577d2a1d6/552197_sld.jpg?auto=format&w=1800",
    creatorID,
  });

  let user;
  try {
    user = await User.findById(creatorID); 
  } catch (err) {
    const error = new HttpError(
      "Failed to create place. Please try again",
      500
    );
    return next(error);
  }

  if(!user) {
    const error = new HttpError('User not found.', 404)
    return next(error)
  }

  console.log(user);

  try {
    const session = await mongoose.startSession(); 
    session.startTransaction(); 
    await createdLocation.save({session: session});
    user.locations.push(createdLocation);
    await user.save({session:session})
    await session.commitTransaction();
  } catch (err) {
    console.log(err)
    const error = new HttpError(
      "Error occured when creating location, please try again",
      500
    );
    return next(error);
  }
  res.status(201).json({ location: createdLocation });
});

//POST ROUTES   -----------------------------------------------------------
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
      return next(new HttpError("Error in data entered, please check", 422));
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

//DELETE ROUTES   -----------------------------------------------------------

router.delete("/:locationID", async (req, res, next) => {
  const locationID = req.params.locationID;

  let location;
  try {
    location = await Location.findById(locationID).populate('creatorID');
  } catch (err) {
    const error = new HttpError("An error occured, unable to delete.", 500);
    return next(error);
  }
  if (!location) {
    const error = new HttpError('Location not found.', 404);
    return next(error)
  }
  console.log(location); 

  try {
    const session = await mongoose.startSession(); 
    session.startTransaction(); 
    await location.remove({session: session});
    location.creatorID.locations.pull(location); 
    await location.creatorID.save({session:session})
    await session.commitTransaction();
  } catch (err) {
    const error = new HttpError('Error occured while deleting location.', 500)
    return next(error) 
  }

  res.status(200).json({ message: "Location deleted!" });
});

module.exports = router;