const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const locationSchema = new Schema({
  name: { type: String, required: true },
  foodOrdered: { type: String, required: true },
  address: { type: String, required: true },
  comments: { type: String },
  revisit: { type: String, required: true },
  coordinates: {
    lat: { type:Number, required: true },
    lng: { type:Number, required: true },
  },
  creatorID: { type: String, required: true },
  img: { type: String },
});

module.exports = mongoose.model("Location", locationSchema);
