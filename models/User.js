//Importation du package mongoose pour communication optimale avec mongoDB
const mongoose = require("mongoose");

//Importation du plugin mongoose-errors pour intercepter les erreurs de BDD et leur donner des codes de statut html
const mongooseErrors = require("mongoose-errors");

//On importe un package pour éviter les bugs à l'identification 
const uniqueValidator = require("mongoose-unique-validator");

//Création du schéma pour les données de l'utilisateur
const userSchema = mongoose.Schema({
    userId: {type: String, required: false},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
});

//Pour qu'on ne puisse pas s'inscrire plusieurs fois avec le même mail
userSchema.plugin(uniqueValidator);

//Pour appliquer la gestion des erreurs mongoose au schéma user
userSchema.plugin(mongooseErrors);

//Exportation du schéma sous le nom "User"
module.exports = mongoose.model("User", userSchema);
