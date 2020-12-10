/*LOGIQUE ROUTE POUR CE QUI CONCERNE L'AUTHENTIFICATION DES USERS */

const express = require("express");
//Création d'un router Express qui contient toutes les routes des requêtes User
const router = express.Router();
//Importation du controller
const userCtrl = require("../controllers/user");

//Requête POST pour inscription
router.post("/signup", userCtrl.signup);

//Requête POST pour connexion
router.post("/login", userCtrl.login);

//Exportation du router
module.exports = router;
