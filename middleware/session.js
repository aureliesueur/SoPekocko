/*MIDDLEWARE POUR SECURISER LES COOKIES DE SESSION */

//Importation du package express-session, pour définir les flags des cookies (contre attaques XSS et CSRF)
const expressSession = require("express-session");

//Définition de la date d'expiration dans 1H
var expiryDate = new Date(Date.now() + 60 * 60 * 1000) 

const session = expressSession({
    secret: "SopOPC20",
    name: "sessionId",  
    cookie: {secure: true, httpOnly: true, sameSite: true, path: "/api/", expires: expiryDate}    
});

module.exports = session; 

