/*MIDDLEWARE CONTRER LE DENIAL OF SERVICE */

//Importation du package toobusy pour empêcher le Denial of Service (DoS) en monitorant le event loop
const toobusy = require("toobusy-js");

module.exports = (req, res, next) => {
    if (toobusy()) {
        res.send(503, "Le serveur est saturé !");
    } else {
        next();
    }
};

