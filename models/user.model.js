/* Ici je définit un schéma Mongoose pour un modèle d'utilisateur, avec différents champs */

//loading mongoose
const mongoose = require('mongoose');
//loading validator 
const { isEmail } = require('validator');
//loading bcrypt
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
  {
    pseudo: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 55,
      unique: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      validate: [isEmail],
      lowercase: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      max: 1024,
      minlength: 6
    },
    picture: {
      type: String,
      default: "./uploads/profil/random-user.png"
    },
    bio :{
      type: String,
      max: 1024,
    },
    followers: {
      type: [String]
    },
    following: {
      type: [String]
    },
    likes: {
      type: [String]
    }
  },
  {
    timestamps: true,
  }
);

// play function before save into DB

/* The userSchema.pre("save", ...) function is a Mongoose middleware that runs before the user document is saved to the database.
 It hashes the user's password with bcrypt and assigns the hashed password to the password field. */
userSchema.pre("save", async function(next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

/* The userSchema.statics.login function is a static method that can be called on the user model.
 It attempts to find a user with the provided email and then compares the provided password to the hashed password in the user document using bcrypt. 
 If the passwords match, it returns the user document. If the email is not found or the passwords do not match, it throws an error. */
userSchema.statics.login = async function(email, password) {
  const user = await this.findOne({ email });
  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      return user;
    }
    throw Error('incorrect password');
  }
  throw Error('incorrect email')
};
//export 
const UserModel = mongoose.model("user", userSchema);

module.exports = UserModel;