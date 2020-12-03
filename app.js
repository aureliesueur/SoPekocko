/*Importation des packages utilisés pour l'appli : 
- express (frameworks pour faciliter l'usage de Node js)
- bodyparser (pour rendre les données du corps de tous types de requêtes exploitable)
- mongoose (accès à la base de données et à ses fonctionnalités pour un site dynamique)
- bcrypt (cryptage mots de passe).
*/    
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
//Importation des routers pour les requêtes sauce/user
const sauceRoutes = require("./routes/sauce");
const userRoutes = require("./routes/user");
//Importation pour accéder au path du server
const path = require("path");

//Connexion à la base de données
mongoose.connect("mongodb+srv://aureliesueur:OPCsueur20@cluster0.znlpu.mongodb.net/test?retryWrites=true&w=majority",
    {useNewUrlParser: true,
     useUnifiedTopology: true})
    .then(() => console.log("Connexion à MongoDB réussie !"))
    .catch(() => console.log("La connexion à MongoDB a échoué !"));

//Déclaration de notre appli comme fonctionnant avec express (et donc Node)
const app = express();

//Ajout des headers aux réponses pour permettre le CORS, cross origin resource sharing
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*"); 
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"); 
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS"); 
    next();
});

//Mise à un format exploitable du body des requêtes
app.use(bodyParser.json());

//Définit les route des deux routeurs "Sauce"/"User" ainsi que pour les images téléchargées
app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/api/sauces", sauceRoutes);
app.use("/api/auth", userRoutes);

//Exportation de l'appli vers server.js 
module.exports = app;