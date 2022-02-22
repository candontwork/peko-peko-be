const axios = require("axios");
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
  }

  const coordinates = data.results[0].geometry.location;
  return coordinates
}

module.exports = addressToCoord;
