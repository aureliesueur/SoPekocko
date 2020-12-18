/*MIDDLEWARE LIMITANT LE NOMBRE MAXIMAL DE TENTATIVES D'AUTHENTIFICATION */

//Importation du package express-rate-limit : pour protéger le système contre le "brute force" (essai multiple de combinaisons de passwords et usernames par le hacker)
const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
    windowMs : 60 * 1000, 
    max: 5, 
    message: "Vous avez dépassé le nombre maximal de tentatives, merci de réessayer ultérieurement."
});

module.exports = limiter; 