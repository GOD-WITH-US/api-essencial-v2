/* Ici je définit un schéma Mongoose pour un modèle de post avec differents champs */
const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
    posterId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      trim: true,
      maxlength: 50,
    },
    text: {
      type: String,
      //trim: true, élimine les espaces
      maxlength: 2000,
    },
    category: {
      type: String,
      required: true,
    },
    picture: {
      type: String,
    },
    video: {
      type: String,
    },
    likers: {
      type: [String],
      required: true,
    },
    comments: {
      type: [
        {
          commenterId: String,
          commenterPseudo: String,
          text: String,
          timestamp: Number,
        },
      ],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("post", PostSchema);
