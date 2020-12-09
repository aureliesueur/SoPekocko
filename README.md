PROJECT OPENCLASSROOM P6 : PIQUANTE BACKEND 


PREREQUISITES
This project uses NodeJs 10.13.0, Express and MongoDB for the backend, and Angular CLI 7.0.2 and node-sass 5.0 for the frontend. 
You will need to have Node, npm, Angular and node-sass installed locally on your machine.

INSTALLATION

Please clone this repository : it will be the backend part of Piquante app.
To get the frontend part, please clone the following GitHub repository : https://github.com/OpenClassrooms-Student-Center/dwj-projet6.

ACCESS TO THE DATABASE 

1) Create your own account on MongoDB (Link : https://account.mongodb.com/account/login?signedOut=true). 
2) Create your own free cluster, with AWS option and free options only.
    - In "database access", define a new user with "read and write" privilege, choosing your own username and password.
    - In "Network Access", click on "Add IP Adress" an "Add access from Anywhere".
    - Click on "Connect Cluster" and "Connect your application", you'll get a connexion string : copy it. Then erase the beginning string "username:<password>@" in our connection string.
3) In the SoPekocko backend folder, create your own .env file, in which you need to write down : 
    DB_URI = your connexion string
    DB_USER = your own username
    DB_PASS = your own password
4) You will have to create your own data to test the application.

RUN THE APP
You will need two terminal windows : one for frontend, one for backend.
Frontend terminal : run "ng serve". The app's frontend is visible on http://localhost:4200/. 
Backend terminal : run "node server" or "nodemon server.js". The server should run on localhost with default port 3000.
