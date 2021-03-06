//Importation du package mongoose pour communication optimale avec mongoDB
const mongoose = require("mongoose");

//Importation du plugin mongoose-errors pour intercepter les erreurs de BDD et leur donner des codes de statut html
const mongooseErrors = require("mongoose-errors");

//Création du schéma pour la ressource "sauce"
const sauceSchema = mongoose.Schema({
    userId: {type: String, required: true},
    name: {type: String, required: true},
    manufacturer: {type: String, required: true},
    description: {type: String, required: true},
    mainPepper: {type: String, required: true},
    imageUrl: {type: String, required: false},
    heat: {type: Number, required: true},
    likes: {type: Number, required: true, default: 0},
    dislikes: {type: Number, required: true, default: 0},
    usersLiked: {type: Array, required: true, default: []},
    usersDisliked: {type: Array, required: true, default: []}, 
});

//Pour appliquer la gestion des erreurs mongoose au schéma user
sauceSchema.plugin(mongooseErrors);

//Exportation du schéma sous le nom "Sauce"
module.exports = mongoose.model("Sauce", sauceSchema);