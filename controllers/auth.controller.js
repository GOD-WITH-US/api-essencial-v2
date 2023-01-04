// ici je vais gèrer l'inscription la connection et déconnection des utilisateurs

// Load the UserModel module
const UserModel = require("../models/user.model");

// Define the signUp function for handling user sign up
module.exports.signUp = async (req, res) => {
  // Destructure the pseudo, email, and password from the request body
  const { pseudo, email, password } = req.body;

  try {
    // Create a new user with the provided pseudo, email, and password
    const user = await UserModel.create({ pseudo, email, password });

    // Respond with a status of 201 (Created) and the ID of the newly created user for verification
    res.status(201).json({ user: user._id });
  } catch (err) {
    // If an error occurs, send a response with a status of 200 (OK) and the error message
    res.status(200).send({ err });
  }
};