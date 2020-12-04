//Importation du package mongoose pour communication optimale avec mongoDB
const mongoose = require("mongoose");

//Création du schéma pour la ressource "sauce"
const sauceSchema = mongoose.Schema({
    //id: {type: String, required: true},
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

//Exportation du schéma sous le nom "Sauce"
module.exports = mongoose.model("Sauce", sauceSchema);