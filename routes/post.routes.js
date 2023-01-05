/* Ici je  définit un routeur Express avec plusieurs routes pour gérer les posts,
les actions de base de données des posts et les téléchargements de fichiers.*/

//loading express router
const router = require("express").Router();

//loading postController
const postController = require("../controllers/post.controller");

const multer = require("multer");
const upload = multer();

// Set up routes for interacting with posts

// Retrieve list of posts
router.get("/", postController.readPost);
// Create a new post with a file
router.post("/", upload.single("file"), postController.createPost);
// Update a post with a specified ID
router.put("/:id", postController.updatePost);
// Delete a post with a specified ID
router.delete("/:id", postController.deletePost);
// Like a post with a specified ID
router.patch("/like-post/:id", postController.likePost);
// Unlike a post with a specified ID
router.patch("/unlike-post/:id", postController.unlikePost);

// Set up routes for interacting with comments on posts

// Add a comment to a post with a specified ID
router.patch("/comment-post/:id", postController.commentPost);
// Edit a comment on a post with a specified ID
router.patch("/edit-comment-post/:id", postController.editCommentPost);
// Delete a comment on a post with a specified ID
router.patch("/delete-comment-post/:id", postController.deleteCommentPost);

module.exports = router;
