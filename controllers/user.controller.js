//ici je gere mes utilisateurs et leurs relations

// Import the User model
const UserModel = require("../models/user.model");

// Create an ObjectId object for unique IDs
const ObjectID = require("mongoose").Types.ObjectId;

// Get all users without password
module.exports.getAllUsers = async (req, res) => {
  // Retrieve all user documents and exclude the "password" field
  const users = await UserModel.find().select("-password");

  // Log the retrieved users to the console
  console.log(" usercontroller log", users);

  // Return a response with a 200 status code and the retrieved users
  res.status(200).json(users);
};

// Get one user by ID
module.exports.userInfo = async (req, res) => {
  console.log("userinfo log", req.params);

  // Check if the ID in the request is a valid ObjectID
  if (!ObjectID.isValid(req.params.id)) {
    // If not, return a response with a 400 status code and an error message
    return res.status(400).send("ID unknown : " + req.params.id);
  }

  try {
    // Retrieve the user document with the matching ID and exclude the "password" field
    const user = await UserModel.findById(req.params.id).select("-password");

    // Return a response with the retrieved user document
    res.send(user);
  } catch (err) {
    console.log("findById ID unknown : " + err);
  }
};

// Update user with ID
module.exports.updateUser = async (req, res) => {
  // Check if the ID in the request is a valid ObjectID
  if (!ObjectID.isValid(req.params.id)) {
    // If not, return a response with a 400 status code and an error message
    return res.status(400).send("ID unknown : " + req.params.id);
  }

  try {
    // Update the user document with the matching ID and set the "bio" field to the value in the request body
    const user = await UserModel.findByIdAndUpdate(
      req.params.id,
      { $set: { bio: req.body.bio } },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    // Return a response with the updated user document
    res.send(user);
  } catch (err) {
    // If there is an error, return a response with a 500 status code and the error message
    return res.status(500).json({ message: err });
  }
};

//delete one user
module.exports.deleteOne = async (req, res) => {
  // Check if the ID in the request is a valid ObjectID
  if (!ObjectID.isValid(req.params.id)) {
    // If not, return a response with a 400 status code and an error message
    return res.status(400).send("ID unknown : " + req.params.id);
  }

  try {
    // Delete the user document with the matching ID
    const user = await UserModel.findByIdAndDelete(req.params.id);

    // Return a response with a 200 status code and a success message
    res.status(200).json({ message: "Successfully deleted. " });
  } catch (err) {
    // If there is an error, return a response with a 500 status code and the error message
    return res.status(500).json({ message: err });
  }
};

//follow
module.exports.follow = async (req, res) => {
  // Check if the IDs in the request are valid ObjectIDs
  if (
    !ObjectID.isValid(req.params.id) ||
    !ObjectID.isValid(req.body.idToFollow)
  ) {
    // If not, return a response with a 400 status code and an error message
    return res.status(400).send("ID unknown : " + req.params.id);
  }

  try {
    // Update the user's "following" array with the ID of the user to follow
    const user = await UserModel.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { following: req.body.idToFollow } },
      { new: true, upsert: true }
    );

    // Update the user to follow's "followers" array with the ID of the user
    const userToFollow = await UserModel.findByIdAndUpdate(
      req.body.idToFollow,
      { $addToSet: { followers: req.params.id } },
      { new: true, upsert: true }
    );

    // Return a response with a 201 status code and the updated user and user to follow documents
    res.status(201).json({ user, userToFollow });
  } catch (err) {
    // If there is an error, return a response with a 500 status code and the error message
    return res.status(500).json({ message: err });
  }
};

//unfollow
module.exports.unfollow = async (req, res) => {
  // Check if the IDs in the request are valid ObjectIDs
  if (
    !ObjectID.isValid(req.params.id) ||
    !ObjectID.isValid(req.body.idToUnfollow)
  ) {
    // If not, return a response with a 400 status code and an error message
    return res.status(400).send("ID unknown : " + req.params.id);
  }

  try {
    // Remove the ID of the user to unfollow from the current user's "following" array
    const user = await UserModel.findByIdAndUpdate(
      req.params.id,
      { $pull: { following: req.body.idToUnfollow } },
      { new: true, upsert: true }
    );

    // Remove the current user's ID from the user to unfollow's "followers" array
    const userToUnfollow = await UserModel.findByIdAndUpdate(
      req.body.idToUnfollow,
      { $pull: { followers: req.params.id } },
      { new: true, upsert: true }
    );

    // Return a response with a 204 status code to indicate that the request was successful
    // and that the server has fulfilled the request, but does not need to return an entity-body
    res.sendStatus(204);

  } catch (err) {
    // If there is an error, return a response with a 500 status code and the error message
    return res.status(500).json({ message: err });
  }
};
