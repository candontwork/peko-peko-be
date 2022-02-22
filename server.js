const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const app = express();
const cors = require('cors');

const PORT = process.env.PORT || 8080;
const db = mongoose.connection
const DATABASE = process.env.DATABASE;
const MONGO_USER = process.env.MONGO_USER;
const MONGO_PASSWORD = process.env.MONGO_PASSWORD;
const MONGO_BASE_URL = process.env.MONGO_BASE_URL
const MONGO_URL = `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_BASE_URL}/${DATABASE}?retryWrites=true&w=majority`

//middleware
app.use(express.json());
app.use(cors()); 

//Controllers
const locationController = require("./controllers/locationController");
const userController = require("./controllers/userController");
const HttpError = require("./models/error-handler");

app.use("/api/locations", locationController);
app.use("/api/user", userController);

app.use((req, res) => {
  const err = new HttpError('Page does not exist', 404);
  throw err; 
})

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || 'An unknown error occurred!' });
});

//mango
mongoose.connect(MONGO_URL).then(async () => {
  console.log('database connected')
  app
    .listen(PORT, () => {
      console.log("listening on", PORT);
    })
});

db.on('err', (err) => console.log(err.message + "is Mongo not running?"));
db.on('connected', () => console.log('mongo connected'));
db.on('disconnected', () => console.log('mongo disconntected'));
