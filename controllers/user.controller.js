//loading module UserModel
const UserModel = require("../models/user.model");

// create ObjectId for unique id
const ObjectID = require("mongoose").Types.ObjectId;

// Get all users -password
module.exports.getAllUsers = async (req, res) => {
  const users = await UserModel.find().select("-password");
  console.log(" usercontroller log", users);
  res.status(200).json(users);
};

// Get one user select by id
module.exports.userInfo = (req, res) => {
  console.log("userinfo log", req.params);
  //check if ObjectId is not unknow
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);

  UserModel.findById(req.params.id, (err, docs) => {
    if (!err) res.send(docs);
    else console.log("findById ID unknown : " + err);
  }).select("-password");
};

// Update user with ID
module.exports.updateUser = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);

  try {
    await UserModel.findOneAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          bio: req.body.bio,
        },
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    )
      .then((docs) => {
        return res.send(docs);
      });
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};

