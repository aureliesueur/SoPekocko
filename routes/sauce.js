const express = require("express");
//Création d'un router Express qui contient toutes les routes des requêtes "Sauces"
const router = express.Router();
//Importation du middleware d'autorisation pour protéger les routes
const auth = require("../middleware/auth");
//Importation du multer pour le téléchargement d'images/de fichiers
const multer = require("../middleware/multer-config");
//Importation du controller
const sauceCtrl = require("../controllers/sauce");


//Requête POST pour enregistrer une nouvelle sauce
router.post("/", auth, multer, sauceCtrl.createSauce);

//Requête PUT pour modifier une sauce en particulier
router.put("/:id", auth, multer, sauceCtrl.modifySauce);

//Requête DELETE pour supprimer une sauce en particulier
router.delete("/:id", auth, sauceCtrl.deleteSauce);

//Requête GET pour récupérer la liste des sauces
router.get("/", auth, sauceCtrl.getAllSauce);

//Requête GET pour récupérer une sauce en particulier
router.get("/:id", auth, sauceCtrl.getOneSauce);

//Exportation du router
module.exports = router;
