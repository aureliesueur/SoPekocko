PROJECT OPENCLASSROOM P6 : PIQUANTE BACKEND 


PREREQUISITES

This project uses NodeJs 10.13.0, Express and MongoDB for the backend, and Angular CLI 7.0.2 and node-sass 5.0 for the frontend. 
You will need to have Node, npm, Angular and node-sass installed locally on your machine.

INSTALLATION

Please clone this repository : it will be the backend part of Piquante app.
To get the frontend part, please clone the following GitHub repository : https://github.com/OpenClassrooms-Student-Center/dwj-projet6.

ACCESS TO THE DATABASE 

This app uses the plugin dotenv to mask the connexion data.
In this folder, you'll find a ".env-evaluator" file, which will provide you access to mongodb Piquante database, once filled with right values.
To make it work, please change its name to ".env".
Please fill up the values with DB_USER and DB_PASS provided separately.
NB : the validity of this special access ends after a week.

RUN THE APP

You will need two terminal windows : one for frontend, one for backend.
Frontend terminal : run "ng serve". The app's frontend is visible on http://localhost:4200/. 
Backend terminal : run npm install puis "node server". The server should run on localhost with default port 3000.
