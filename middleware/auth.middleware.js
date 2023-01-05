/*ici je vérifie l'authentification d'un utilisateur en utilisant un token JWT et 
en récupérant l'utilisateur correspondant. */

const jwt = require("jsonwebtoken");
const UserModel = require("../models/user.model");

module.exports.checkUser = (req, res, next) => {
  // Get the JWT token from the request cookies
  const token = req.cookies.jwt;
  // If the token exists...
  if (token) {
    // Verify the token's validity with the TOKEN_SECRET secret key
    jwt.verify(token, process.env.TOKEN_SECRET, async (err, decodedToken) => {
      // If the token is invalid...
      if (err) {
        // Set the local user to null and remove the JWT cookie
        res.locals.user = null;
        res.cookie("jwt", "", { maxAge: 1 });
        // Go to the next middleware
        next();
      } else {
        // If the token is valid, find the user with the decoded token ID
        let user = await UserModel.findById(decodedToken.id);
        // Set the local user
        res.locals.user = user;
        // Go to the next middleware
        next();
      }
    });
  } else {
    // If no token was found, set the local user to null
    res.locals.user = null;
    // Go to the next middleware
    next();
  }
};

module.exports.requireAuth = (req, res, next) => {
  // Get the JWT token from the request cookies
  const token = req.cookies.jwt;
  // If the token exists...
  if (token) {
    // Verify the token's validity with the TOKEN_SECRET secret key
    jwt.verify(token, process.env.TOKEN_SECRET, async (err, decodedToken) => {
      // If the token is invalid...
      if (err) {
        // Send an error to the client
        res.send(200).json('no token');
      } else {
        // If the token is valid, go to the next middleware
        console.log(decodedToken.id);
        next();
      }
    });
  } else {
    // If no token was found, send an error to the client
    console.log('No token');
  }
};
