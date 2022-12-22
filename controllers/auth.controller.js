// ici je vais gèrer l'inscription la connection et déconnection des utilisateurs

//loading module UserModel
const UserModel = require("../models/user.model");

module.exports.signUp = async (req, res) => {
  /* console.log("log authcontroller", req.body); */
  const { pseudo, email, password } = req.body;

  try {
    const user = await UserModel.create({ pseudo, email, password });
    //je repond avec un status 201 created et l'id de l'utilisateur pour vérification
    res.status(201).json({ user: user._id });
  } catch (err) {
    res.status(200).send({ err });
  }
};
