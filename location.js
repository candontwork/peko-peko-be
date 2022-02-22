const axios = require("axios");
const HttpError = require("./models/error-handler");
require("dotenv").config();

const API_KEY = process.env.API_KEY;

async function addressToCoord(address) {
  const res = await axios.get(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address
    )}&key=${API_KEY}`
  );

  const data = res.data; 

  if (!data || data.status === 'ZERO_RESULTS') {
    const err = new HttpError(
      'Location not found for this address.', 422
    );
    throw err
  }

  const gcoordinates = data.results[0].geometry.location;
  return gcoordinates
}

module.exports = addressToCoord;
