const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const locationSchema = new Schema({
  name: { String, required: true },
  foodOrdered: { String, required: true },
  comments: { String },
  revisit: { String, required: true },
  address: { String, required: true },
  gcoordinates: {
    lat: { Number, required: true },
    lng: { Number, required: true },
  },
  creatorID: { String, required: true },
});

module.exports = mongoose.model('Location', locationSchema); 
