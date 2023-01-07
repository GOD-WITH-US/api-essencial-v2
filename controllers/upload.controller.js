//Import the User model from a local file
const UserModel = require("../models/user.model");

// Import the fs module from Node.js to work with the file system
const fs = require("fs");

// Use the promisify method from the Node.js util module to transform the pipeline function into a promise function
const { promisify } = require("util");
const pipeline = promisify(require("stream").pipeline);

// Import the uploadErrors constant from a local file
const { uploadErrors } = require("../utils/error.utils");

// Export a function that handles the HTTP request to update the user's profile
module.exports.uploadProfil = async (req, res) => {
  try {
    // Check if the file in the request is a JPG, PNG, or JPEG image and is not too large
    if (
      req.file.detectedMimeType !== "image/jpg" &&
      req.file.detectedMimeType !== "image/png" &&
      req.file.detectedMimeType !== "image/jpeg"
    ) {
      throw new Error("Invalid file type");
    }

    if (req.file.size > 500000) {
      throw new Error("File size exceeded maximum limit");
    }
  } catch (err) {
    // If the file is not a valid image or is too large, return an error message
    const errors = uploadErrors(err);
    return res.status(400).json({ errors });
  }

  // Create a file name for the image using the user's name and a .jpg extension
  const fileName = req.body.name + ".jpg";

  // Write the file to the disk and save the file path in the database for the user with the corresponding user ID from the request
  try {
    await pipeline(
      req.file.stream,
      fs.createWriteStream(
        `${__dirname}/../client/public/uploads/profil/${fileName}`
      )
    );

    // Update the database and wait for the result
    const updatedUser = await UserModel.findByIdAndUpdate(
      req.body.userId,
      { $set: { picture: "./uploads/profil/" + fileName } },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    return res.send(updatedUser);
  } catch (err) {
    // If there is an error updating the database, return an error message
    return res.status(500).send({ message: err });
  }
};
