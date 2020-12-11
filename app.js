/*Importation des packages utilisés pour l'appli : 
- express (frameworks pour faciliter l'usage de Node js)
- bodyparser (pour rendre les données du corps de tous types de requêtes exploitable)
- mongoose (accès à la base de données et à ses fonctionnalités pour un site dynamique)
- dotenv (masquage des données de connextion à la DBbase via un fichier dotenv et une création de variables pour le nom du user et le password)

+ Importation des middleware de protection pour remplir les standards OWASP.
*/  

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const {config} = require("dotenv");
//Importation des routers pour les requêtes sauce/user
const sauceRoutes = require("./routes/sauce");
const userRoutes = require("./routes/user");
//Importation pour accéder au path du server
const path = require("path");

/*Importation des packages de sécurité pour être aux normes OWASP*/
//Package helmet (13 middleware pour sécuriser les données et les connexions : setting Content Security Policy, handling Certificate Transparency, preventing clickjacking, disabling client-side caching, or adding some small XSS protections)
const helmet = require("helmet");
//Package hpp (to protect your system from HTTP parameter pollution attacks)
const hpp = require("hpp");
//Package express-rate-limit : pour protéger le système contre le "brute force" (essai multiple de combinaisons de passwords et usernames par le hacker)
const rateLimit = require("express-rate-limit");
//Package mongo-express-sanitize : validation des données, enlève les données qui commencent par $, qui peuvent être utilisées par des hackers
const mongoSanitize = require("express-mongo-sanitize");
//Package toobusy pour contrer les attaques Denial of Service (DoS) en monitorant le event loop
const toobusy = require("toobusy-js");
//Package express-session, pour définir les flags des cookies (contre attaques XSS et CSRF)
const session = require("express-session");


//Connexion à la base de données avec Mongoose.connect et dotenv
config();
const uri = process.env.DB_URI;
mongoose.connect(uri, {
        user: process.env.DB_USER,
        pass: process.env.DB_PASS,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
    })
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

/*SECURITE : pour sécuriser l'application selon les standards OWASP (cf descriptif ci-dessus)*/

app.use(helmet());
app.use(hpp());
const apiLimiter = rateLimit({windowMs : 60 * 1000, max: 5, message: "Vous avez dépassé le nombre maximal de tentatives, merci de réessayer ultérieurement."});
app.use("/api/auth", apiLimiter);

app.use(function(req, res, next) {
    if (toobusy()) {
        res.send(503, "Server too busy !");
    } else {
        next();
    }
});

var expiryDate = new Date(Date.now() + 60 * 60 * 1000) //Expiration dans 1H
app.use(session({
    secret: "SopOPC20",
    name: "sessionId",  
    cookie: {secure: true, httpOnly: true, sameSite: true, path: "/api/", expires: expiryDate}    
}));

//Définition des tailles limites pour les requêtes pour que les hackers ne puissent pas saturer le système
app.use(express.urlencoded({ limit: "1kb" }));
app.use(express.json({ limit: "1kb" }));

/*FIN SECURITE*/

//Mise à un format exploitable du body des requêtes
app.use(bodyParser.json());

/*SECURITE SUITE*/
//Pour enlever les caractères commençant par $, réservés comme opérateurs pour MongoDB
app.use(mongoSanitize());
/*FIN SECURITE*/

//Définit les route des deux routeurs "Sauce"/"User" ainsi que pour les images téléchargées
app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/api/sauces", sauceRoutes);
app.use("/api/auth", userRoutes);

//Exportation de l'appli vers server.js 
module.exports = app;