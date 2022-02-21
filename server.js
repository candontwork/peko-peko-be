const express = require("express");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 8800;

//middleware
app.use(express.json());


//Controllers
const locationController = require('./controllers/locationController');
const userController = require('./controllers/userController')

app.use('/api/locations', locationController);



//mango
app.listen(PORT, () => {
  console.log("listening on", PORT);
});
