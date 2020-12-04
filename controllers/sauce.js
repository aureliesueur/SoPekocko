//Logique métier pour tout ce qui concerne les requêtes sur les sauces

//Importation du modèles Sauce 
const Sauce = require("../models/Sauce");

//Importation du package fs, qui permet entre autres de supprimer des fichiers
const fs = require("fs");

//Fontion qui gère la logique métier de la route POST (ajout d'une nouvelle sauce)
exports.createSauce = (req, res, next) => {
    //Création d'un objet réponse (constitué de "sauce" et de "image") qu'on met au format json
    const sauceObject = JSON.parse(req.body.sauce);
    //delete sauceObject._id;
    const sauce = new Sauce({
        userId: sauceObject.userId,
        name: sauceObject.name,
        manufacturer: sauceObject.manufacturer,
        description: sauceObject.description,
        //Expression dynamique pour recréer l'adresse url pour trouver le fichier téléchargé récupéré par multer
        imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
        mainPepper: sauceObject.mainPepper,
        heat: sauceObject.heat,
       // likes: 0,
       // dislikes: 0, 
        //usersLiked: [],
        //usersDisliked: []
    });
    sauce.save()
        .then(() => res.status(201).json({message: "Sauce enregistrée !"}))
        .catch(error => res.status(400).json({error}));
};

//Fontion qui gère la logique métier de la route PUT (modification d'une sauce existante)
exports.modifySauce = (req, res, next) => {
    //Création d'un objet réponse qu'on interroge pour savoir s'il y a un fichier image à télécharger ou non
    const sauceObject = req.file ?
        {
        //Si oui, on récupère la partie "sauce" de l'objet réponse qu'on met en json
        ...JSON.parse(req.body.sauce),
        //Expression dynamique pour recréer l'adresse url pour trouver le fichier téléchargé récupéré par multer
        imageUrl:`${req.protocol}://${req.get("host")}/images/${req.file.filename}`
        //Si non, on récupère directement le body de la requête
        } : {...req.body};
    //On met à jour en remplaçant les données mais en gardant le même id
    Sauce.updateOne({_id: req.params.id}, {...sauceObject, _id: req.params.id})
        .then(() => res.status(200).json({message : "Sauce modifiée !"}))
        .catch(error => res.status(400).json({error}));
};

//Fontion qui gère la logique métier de la route DELETE (suppression d'une sauce existante)
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id})
        .then(sauce => {
        //Récupération du nom de fichier à la fin de l'URL
        const filename = sauce.imageUrl.split("/images/")[1];
        //Suppression du fichier image stocké par multer via une expression dynamique
        fs.unlink(`images/${filename}`, () => {
            Sauce.deleteOne({_id: req.params.id})
                .then(() => res.status(200).json({message : "Sauce supprimée !"}))
                .catch(error => res.status(400).json({error}));
            });
        })
        .catch(error => res.status(500).json({error}));
};

//Fontion qui gère la logique métier de la route GET (récupération de toutes les sauces)
exports.getAllSauce = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({error}));
};

//Fontion qui gère la logique métier de la route GET (récupération d'une sauce spécifique)
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id})
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({error}));
};


//Fontion qui gère la logique métier de la route POST (Like/Dislike):
//Ajout du like quand on clique sur like + ajout du user au tableau UsersLiked
//Ajout du dislike quand on clique sur dislike + ajout du user au tableau UsersDisliked
//Suppression du like ou du dislike quand le user clique à nouveau + suppression du user dans le tableau correspondant
exports.likeSauce = (req, res, next) => {
    switch (req.body.like) {
        case 1:
            //Si le user a cliqué sur like, on met à jour le produit sauce en incrémentant les likes de 1 et en intégrand l'id du user dans le tableau usersLiked
            Sauce.updateOne({_id: req.params.id}, {
                _id: req.params.id,
                $inc: {likes: + req.body.like},
                $push: {usersLiked: req.body.userId},
            })
            .then(() => res.status(201).json({message: "Like enregistré !"}))
            .catch(error => res.status(400).json({error}));
            break;
        case -1:
            //Si le user a cliqué sur dislike, on met à jour le produit sauce en incrémentant les dislikes de 1 et en intégrand l'id du user dans le tableau usersDisliked
            Sauce.updateOne({_id: req.params.id}, {
                _id: req.params.id,
                $inc: {dislikes: + req.body.like * -1},
                $push: {usersDisliked: req.body.userId},
            })
            .then(() => res.status(201).json({message: "Dislike enregistré !"}))
            .catch(error => res.status(400).json({error}));
            break;
        case 0:
             //Si le user reclique sur like ou dislike, annulation du like ou du dislike précédent
            Sauce.findOne({_id: req.params.id})
                .then(sauce => {
                console.log(sauce);
                //Si l'id du user est présent dans le tableau des usersLiked, c'est qu'il a liké précédemment, donc on annule son like
                    if (sauce.usersLiked.indexOf(req.body.userId) !== -1) {
                        Sauce.updateOne({_id: req.params.id}, {
                            _id: req.params.id,
                            $inc: {likes: -1},
                            $pull: {usersLiked: req.body.userId},
                        })
                        .then(() => res.status(201).json({message: "Annulation du like enregistrée !"}))
                        .catch(error => res.status(400).json({error}));
                    }
                //Si l'id du user est présent dans le tableau des usersDisliked, c'est qu'il a disliké précédemment, donc on annule son dislike
                    if (sauce.usersDisliked.indexOf(req.body.userId) !== -1) {
                        Sauce.updateOne({_id: req.params.id}, {
                            _id: req.params.id,
                            $inc: {dislikes: -1},
                            $pull: {usersDisliked: req.body.userId}
                        })
                        .then(() => res.status(201).json({message: "Annulation du dislike enregistrée !"}))
                        .catch(error => res.status(400).json({error}));
                    }
                })
                .catch(error => res.status(500).json({error}));
            break;
        default:
            console.log("Cette réponse n'est pas valide !");
        } 
};
            
 // A VERIFIER : PETIT BUG AVEC DES POUCES QUI DEVIENNENT NEGATIFS CF LIGNE 101, 116, 126. LIMITER A DU POSITIF LES LIKE ET DISLIKE           