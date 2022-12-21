//loading express router
const router = require("express").Router();

//loading autController
const authController = require("../controllers/auth.controller");

// route for registry 
router.post("/register", authController.signUp);

//loading userController
const userController = require("../controllers/user.controller");

//route for user DB
router.get('/', userController.getAllUsers);
router.get('/:id', userController.userInfo);
router.put("/:id", userController.updateUser);

//on rend notre module disponible dans toute l'app
module.exports = router;
