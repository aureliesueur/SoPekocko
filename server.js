//Importation du package http nécessaire pour créer un serveur
const http = require("http");
//Importation de l'appli app.js pour connecter appli et serveur
const app = require("./app");

//Fonction qui permet de transformer en PORT qui est en string, en nombre
const normalizePort = val => {
    const port = parseInt(val, 10);
    if (isNaN(port)) {
        return val;
    }
    if (port >= 0) {
        return port;
    }
    return false;
};

//Déclaration du port sur lequel va runner le serveur et s'exécuter le backend
const port = normalizePort(process.env.PORT || 3000);
app.set("port", port);

//Gestion des erreurs de serveurs (accès interdit, serveur déjà en activité...)
const errorHandler = error => {
    if (error.syscall !== "listen") {
        throw error;
    }
    const address = server.address();
    const bind = typeof address === "string" ? "pipe " + address : "port " + port;
    switch (error.code) {
        case "EACCES": 
            console.error(bind + " requires elevated privileges");
            process.exit(1);
            break;
        case "EADDRINUSE":
            console.error(bind + " is already in use");
            process.exit(1);
            break;
        default:
            throw error;
    }
};

//Création du serveur en lui-même
const server = http.createServer(app);
   
//Création d'événements, en cas d'erreur ou en cas d'écoute réussie
server.on("error", errorHandler);
server.on("listening", () => {
    const address = server.address();
    const bind = typeof address === "string" ? "pipe " + address : "port " + port;
    console.log("Listening on " + bind);
});

//Mise en route de l'écoute serveur
server.listen(port);  