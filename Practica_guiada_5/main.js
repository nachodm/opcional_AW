"use strict"

const mysql = require("mysql");
const config = require("./config");
const path = require("path");
const express = require("express");
const expressValidator = require("express-validator");
const bodyParser = require("body-parser");
const session = require("express-session");
const mysqlSession = require("express-mysql-session");
const DaoUsers = require("./public/js/DAOUsers");

const MySQLStore = mysqlSession(session);
const sessionStore = new MySQLStore({
    host: config.host,
    user: config.user,
    password: config.password,
    database: config.database
});

let pool = mysql.createPool({
    host: config.host,
    user: config.user,
    password: config.password,
    database: config.database
});

const middlewareSession = session({
    saveUninitialized: false,
    secret: "foobar34",
    resave: false,
    store: sessionStore
});

const daouser = new DaoUsers(pool);

var app = express();

app.use(expressValidator());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(middlewareSession);
const ficherosEstaticos = path.join(__dirname, "public");

app.use(express.static(ficherosEstaticos));
app.set("view engine", "ejs");


app.set("views", path.join(__dirname, "public/views"));

app.get("/", (request, response)=>{
    
    response.render("login", {errorMSG: null});
})

app.post("/login", (request, response)=>{
   
    request.checkBody("email","Dirección de correo no válida").isEmail();
    request.getValidationResult().then(function(result){
        if(result.isEmpty()){
            daouser.isUserCorrect(request.body.email, request.body.pass, (err, result)=>{
                if(err) {
                    
                    response.render("login", {errorMSG: err.message});
                }
                else{
                    request.session.loggedUser = request.body.email;
                    response.redirect("main.html");
                }
            })
            result.array().push("Contraseña o email incorrectos");
            response.render("login", {errorMSG: result.array() });
        }
        else{
            console.log(result.array());
            response.render("login", {errorMSG: result.array()});  
        }
    });
});

app.listen(config.port, function (err) {
    if (err) {
        console.log("No se ha podido iniciar el servidor.");
        console.log(err);
    } else {
        console.log(`Servidor escuchando en puerto ${config.port}.`);
    }
});
    
