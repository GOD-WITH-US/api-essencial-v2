//loading express router
const router = require("express").Router();

//loading autController
const authController = require("../controllers/auth.controller");

//loading userController
const userController = require("../controllers/user.controller");

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


//on rend notre module disponible dans toute l'app
module.exports = router;
