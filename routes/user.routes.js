/* Ici je  définit un routeur Express avec plusieurs routes pour gérer l'authentification,
les actions de base de données d'utilisateur et les téléchargements de fichiers.*/

//loading express router
const router = require("express").Router();

//loading autController
const authController = require("../controllers/auth.controller");

//loading userController
const userController = require("../controllers/user.controller");

//loading uploadController
const uploadController = require("../controllers/upload.controller");

//Loading multer
const multer = require("multer");
const upload = multer();

// route for registry
router.post("/register", authController.signUp);
// route for login
router.post("/login", authController.signIn);
// route for logout
router.get("/logout", authController.logout);

//route for get all user
router.get("/", userController.getAllUsers);
//route for one user info
router.get("/:id", userController.userInfo);
//route for update user
router.put("/:id", userController.updateUser);
//route for delete one user
router.delete("/:id", userController.deleteOne);

//route for follow
router.patch("/follow/:id", userController.follow);
//route for unfollow
router.patch("/unfollow/:id", userController.unfollow);

// upload
router.post("/upload", upload.single("file"), uploadController.uploadProfil);

// we make our module available throughout the app
module.exports = router;
