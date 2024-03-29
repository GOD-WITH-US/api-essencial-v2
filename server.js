//loading express framework
const express = require("express");

//create app on express framework
const app = express();

//loading module dotenv and load my files from .env
require("dotenv").config({ path: "./config/.env" });

//require db.js to connect to mongoDB
require("./config/db");


//loading body-parser middleware
const bodyParser = require("body-parser");

//loading cookie-parser middleware
const cookieParser = require("cookie-parser");

//loading user routes
const userRoutes = require("./routes/user.routes");
//loading post routes
const postRoutes = require("./routes/post.routes");

// Enable JSON data parsing in request body
app.use(bodyParser.json());
// Enable URL-encoded data parsing in request body, with support for nested objects
app.use(bodyParser.urlencoded({ extended: true }));
// Enable cookie parsing in request headers
app.use(cookieParser());

//loading auth middleware
const { checkUser, requireAuth } = require("./middleware/auth.middleware");

//loading cors 
const cors = require('cors');

// jwt
app.get('*', checkUser);
app.get('/jwtid', requireAuth, (req, res) => {
  res.header("Access-Control-Allow-Origin", process.env.CLIENT_URL);
  res.header("Access-Control-Allow-Credentials", true);
  res.status(200).send(res.locals.user._id)
});
//Cors
const corsOptions = {
  origin: process.env.CLIENT_URL,
  credentials: true,
  'allowedHeaders': ['sessionId', 'Content-Type'],
  'exposedHeaders': ['sessionId'],
  'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
  'preflightContinue': false
}

app.use(cors(corsOptions));


//routes
/* control tools 
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
}); */
app.use("/api/user", userRoutes);
app.use("/api/post", postRoutes);
app.use('/uploads/profil', express.static('client/public/uploads/profil'));
app.use('/uploads/posts', express.static('client/public/uploads/posts'));


//Start server and listen to a given Port
app.listen(process.env.PORT, () => {
  console.log(`Listening on port ${process.env.PORT}`);
});
