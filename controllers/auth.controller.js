// ici je vais gèrer l'inscription la connection et déconnection des utilisateurs

// Load the UserModel module
const UserModel = require("../models/user.model");

const jwt = require("jsonwebtoken");

// Import the error handling functions from the error.utils module
const { signUpErrors, signInErrors } = require("../utils/error.utils");

// The auth token will be valid for 3 days before expiry
const maxAge = 3 * 24 * 60 * 60 * 1000;

// Function to create a token from the user's ID
const createToken = (id) => {
  return jwt.sign({ id }, process.env.TOKEN_SECRET, {
    expiresIn: maxAge,
  });
};

// User signup function
module.exports.signUp = async (req, res) => {
  // Get the pseudo, email, and password from the request
  const { pseudo, email, password } = req.body;
  try {
    // Create the user using the UserModel
    const user = await UserModel.create({ pseudo, email, password });
    // Send the user's ID in the response to the request
    res.status(201).json({ user: user._id });
  } catch (err) {
    const errors = signUpErrors(err);
    // Handle errors in user creation
    res.status(400).send({ errors });
  }
};

// User signin function
module.exports.signIn = async (req, res) => {
  // Get the email and password from the request
  const { email, password } = req.body;
  try {
    // Sign in the user using the UserModel
    const user = await UserModel.login(email, password);
    // Create a token from the user's ID
    const token = createToken(user._id);
    // Send the token in a cookie with a maxAge lifespan
    res.cookie("jwt", token, { httpOnly: true, maxAge });
    // Send the user's ID in the response to the request
    res.status(200).json({ user: user._id });
  } catch (err) {
    const errors = signInErrors(err);
    // Handle errors in user sign in
    res.status(401).json({ errors });
  }
};

// User logout function
module.exports.logout = (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.redirect("/");
};
