//loading module dotenv and load my files from .env
require("dotenv").config({ path: "./config/.env" });
//loading body-parser middleware
const bodyParser = require("body-parser");

//loading express framework
const express = require("express");
//create app on express framework
const app = express();
//loading routes
const userRoutes = require("./routes/user.routes");

//use body-parser for format req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//require db.js to connect to mongoDB
require("./config/db");

//routes
app.use("/api/user", userRoutes);


//Start server and listen to a given Port
app.listen(process.env.PORT, () => {
  console.log(`Listening on port ${process.env.PORT}`);
});
