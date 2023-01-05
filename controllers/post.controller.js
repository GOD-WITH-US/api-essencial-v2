const mongoose = require("mongoose");
const PostModel = require("../models/post.model");
const UserModel = require("../models/user.model");
const { uploadErrors } = require("../utils/error.utils");
const fs = require("fs");
const { promisify } = require("util");
const pipeline = promisify(require("stream").pipeline);

// exports a function that fetches all the posts from the database,
// sorts them in descending order of creation time, and sends them in the response
module.exports.readPost = async (req, res) => {
  try {
    const posts = await PostModel.find().sort({ createdAt: -1 });
    res.send(posts);
  } catch (err) {
    console.log(`Error getting posts: ${err}`);
  }
};

// exports a function that creates a new post
module.exports.createPost = async (req, res) => {
  let fileName;

  // check if the file being uploaded is an image with a valid file type and size
  if (req.file !== null) {
    try {
      if (
        req.file.detectedMimeType != "image/jpg" &&
        req.file.detectedMimeType != "image/png" &&
        req.file.detectedMimeType != "image/jpeg"
      ) {
        throw new Error("Invalid file type");
      }
      if (req.file.size > 500000) {
        throw new Error("File size exceeded maximum limit of 500KB");
      }
    } catch (err) {
      const errors = uploadErrors(err);
      return res.status(400).json({ errors });
    }
    // set fileName to the ID of the poster + current timestamp + .jpg
    fileName = `${req.body.posterId}${Date.now()}.jpg`;

    // save the file to the server
    await pipeline(
      req.file.stream,
      fs.createWriteStream(
        `${__dirname}/../client/public/uploads/posts/${fileName}`
      )
    );
  }

  // create a new instance of postModel
  const newPost = new PostModel({
    posterId: req.body.posterId,
    message: req.body.message,
    // set the picture field to the path of the file if it exists, otherwise set it to an empty string
    picture: req.file !== null ? `./uploads/posts/${fileName}` : "",
    video: req.body.video,
    likers: [],
    comments: [],
  });

  try {
    // save the new instance to the database and send it in the response
    const post = await newPost.save();
    res.status(201).json(post);
  } catch (err) {
    // send the error in the response if there was an issue saving the instance
    res.status(400).send(err);
  }
};

module.exports.updatePost = async (req, res) => {
  // check if the provided ID is a valid MongoDB ObjectId
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).send(`Invalid post ID: ${req.params.id}`);
  }

  try {
    // update the post with the given ID
    const updatedPost = await PostModel.findByIdAndUpdate(req.params.id, {
      message: req.body.message,
    });
    res.send(updatedPost);
  } catch (err) {
    console.log(`Error updating post: ${err}`);
  }
};

// exports a function that deletes a post with the given ID
module.exports.deletePost = async (req, res) => {
  // check if the provided ID is a valid MongoDB ObjectId
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).send(`Invalid post ID: ${req.params.id}`);
  }

  try {
    // delete the post with the given ID
    const deletedPost = await PostModel.findByIdAndDelete(req.params.id);
    res.send(deletedPost);
  } catch (err) {
    console.log(`Error deleting post: ${err}`);
  }
};

// exports a function that adds a user's ID to the likers array of a post with the given ID
module.exports.likePost = async (req, res) => {
  // check if the provided ID is a valid MongoDB ObjectId
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).send(`Invalid post ID: ${req.params.id}`);
  }

  try {
    // add the user's ID to the likers array of the post with the given ID
    await PostModel.findByIdAndUpdate(req.params.id, {
      $addToSet: { likers: req.body.id },
    });
    // add the post's ID to the likes array of the user
    await UserModel.findByIdAndUpdate(req.body.id, {
      $addToSet: { likes: req.params.id },
    });
    res.sendStatus(200);
  } catch (err) {
    console.log(`Error liking post: ${err}`);
  }
};

module.exports.unlikePost = async (req, res) => {
  // Check if the provided ID is valid
  if (!ObjectID.isValid(req.params.id)) {
    return res.status(400).send(`Invalid ID: ${req.params.id}`);
  }

  try {
    // Find and update the post document
    const post = await PostModel.findByIdAndUpdate(
      req.params.id,
      {
        $pull: { likers: req.body.id },
      },
      { new: true }
    );

    // Find and update the user document
    const user = await UserModel.findByIdAndUpdate(
      req.body.id,
      {
        $pull: { likes: req.params.id },
      },
      { new: true }
    );

    // Send the updated user document as the response
    res.send(user);
  } catch (err) {
    // Return a 400 error if an exception occurs
    return res.status(400).send(err);
  }
};

module.exports.commentPost = (req, res) => {
  // Check if the provided ID is valid
  if (!ObjectID.isValid(req.params.id)) {
    return res.status(400).send(`Invalid ID: ${req.params.id}`);
  }

  try {
    // Find and update the post document
    return PostModel.findByIdAndUpdate(
      req.params.id,
      {
        $push: {
          comments: {
            commenterId: req.body.commenterId,
            commenterPseudo: req.body.commenterPseudo,
            text: req.body.text,
            timestamp: new Date().getTime(),
          },
        },
      },
      { new: true },
      (err, docs) => {
        // Return the updated post document as the response
        if (!err) return res.send(docs);
        // Return a 400 error if an exception occurs
        else return res.status(400).send(err);
      }
    );
  } catch (err) {
    // Return a 400 error if an exception occurs
    return res.status(400).send(err);
  }
};

module.exports.editCommentPost = (req, res) => {
  // Check if the provided ID is valid
  if (!ObjectID.isValid(req.params.id)) {
    return res.status(400).send(`Invalid ID: ${req.params.id}`);
  }

  try {
    // Find the post document
    return PostModel.findById(req.params.id, (err, docs) => {
      // Find the comment to edit within the post's comments array
      const theComment = docs.comments.find((comment) =>
        comment._id.equals(req.body.commentId)
      );

      // Return a 404 error if the comment is not found
      if (!theComment) return res.status(404).send("Comment not found");

      // Update the comment text
      theComment.text = req.body.text;

      // Save the updated post document
      return docs.save((err) => {
        // Return the updated post document as the response
        if (!err) return res.status(200).send(docs);
        // Return a 500 error if an exception occurs while saving the document
        return res.status(500).send(err);
      });
    });
  } catch (err) {
    // Return a 400 error if an exception occurs
    return res.status(400).send(err);
  }
};

module.exports.deleteCommentPost = (req, res) => {
  // Check if the provided ID is valid
  if (!ObjectID.isValid(req.params.id)) {
    return res.status(400).send(`Invalid ID: ${req.params.id}`);
  }

  try {
    // Find and update the post document
    return PostModel.findByIdAndUpdate(
      req.params.id,
      {
        $pull: {
          comments: {
            _id: req.body.commentId,
          },
        },
      },
      { new: true },
      (err, docs) => {
        // Return the updated post document as the response
        if (!err) return res.send(docs);
        // Return a 400 error if an exception occurs
        else return res.status(400).send(err);
      }
    );
  } catch (err) {
    // Return a 400 error if an exception occurs
    return res.status(400).send(err);
  }
};
