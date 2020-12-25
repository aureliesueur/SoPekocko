/*LOGIQUE METIER POUR CE QUI CONCERNE L'AUTHENTIFICATION DES USERS */

//Importation du modèles Sauce 
const User = require("../models/User");
//Importation du package de validation des emails
const validator = require("validator");
//Importation du package de cryptage des mots de passe
const bcrypt = require("bcrypt");
//Importation du package de masquage/cryptage des emails avec Rot13 et une key asymétrique pour complexifier le décryptage
var ebg13 = require("ebg13");
//Importation du package qui permet de créer et de vérifier les tokens d'authentification 
const jwt = require("jsonwebtoken");

//Fontion qui gère la logique métier de la route POST (inscription d'un nouvel user)
exports.signup = (req, res, next) => {
    //Validation de l'email
    if (validator.isEmail(req.body.email) !== true) {
        return res.status(401).json({error: "Email non valide"});
    }
    //Cryptage du password 
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
        //Création d'un nouvel utilisateur
        const user = new User({
            email: req.body.email,
            password: hash
        });
    //Masquage de l'email avec Rot13
    const maskedEmail = ebg13(req.body.email, 12);
    user.email = maskedEmail;
    //Enregistrement du new user dans la base de données
        user.save()
            .then(() => res.status(201).json({message : "Utilisateur créé !"}))
            .catch(error => res.status(400).json({error})); 
        })
        .catch(error => res.status(500).json({error})); 
};


//Fontion qui gère la logique métier de la route POST (connexion d'un user existant dans la database)

exports.login = (req, res, next) => {
    //Recherche de l'utilisateur dans la DB via son email (que l'on masque au passage avec Rot13 pour pouvoir le comparer aux emails stockés masqués)
    User.findOne({email: ebg13(req.body.email, 12)})
        .then(user => {
            if (!user) {
                return res.status(404).json({error: "Utilisateur non trouvé !"});
            }
        
            //Si on a trouvé le mail dans la DB, on compare le hash du nouveau mot de passe au hash de la DB
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if(!valid) {
                        return res.status(401).json({error: "Mot de passe incorrect !"});
                    }
                    res.status(200).json({
                        userId: user._id,//ATTENTION USER ID !
                        //Encodage d'un nouveau token
                        token: jwt.sign(
                            {userId : user._id},
                            "RANDOM_TOKEN_SECRET",
                            {expiresIn: "24h"}
                        )
                    });
                })
                .catch(error => res.status(500).json({error}));
            })
        .catch(error => res.status(500).json({error}));
};
