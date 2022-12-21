//chargement du router d'express 
const router = require('express').Router();

//appel du autController
const authController = require ('../controllers/auth.controller');

// route pour s'enregistrer
router.post('/register', authController.signUp);

//on rend notre module disponible dans toute l'app
module.exports = router;