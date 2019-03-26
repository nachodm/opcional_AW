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
const DaoTask = require("./public/js/DAOTasks");

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
const daotask = new DaoTask(pool);

var app = express();

app.use(expressValidator());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(middlewareSession);
const ficherosEstaticos = path.join(__dirname, "public");

app.use(express.static(ficherosEstaticos));
app.set("view engine", "ejs");


app.set("views", path.join(__dirname, "public/views"));

app.get("/login", (request, response) => {

    response.render("login", { errorMSG: null });
})

app.get("/task", (request, response) => {
    daotask.getAllTasks(request.session.currentUser, (error, tareas) => {
        if (error) {
            console.log(error); response.end();
        } else {
            response.render("tasks", { tareas: tareas, user: request.session.currentUser })
        }
    })
})

app.post("/login", (request, response) => {

    daouser.isUserCorrect(request.body.email, request.body.pass, (err, result) => {
        if (err) {
            response.render("login", { errorMSG: "usuario o contraseña incorrectos" });
        }
        else {
            request.session.currentUser = request.body.email;
            response.redirect("task");
        }
    })
});

app.post("/logout", (request, response) => {
    request.session.destroy();
    response.redirect("login");
})

function comprobar(request, response, next) {
    if (request.session.currentUser) {
        response.locals.userEmail = request.body.mail;
        next();
    } else {
        response.redirect("login");
    }
}

app.post("/finalizar", (request, response) => {
    let task = request.body.id;
    daotask.markTaskDone(Number(task), (error, tasks) => {
        if (error) { console.log(error); response.end(); }
        else {
            response.redirect("task");
        }
    })

});

app.post("/addTask", (request, response) => {
    let task = {
        text: request.body.text,
        done: 0,
        tag: []
    }
    task.tag.push("personal");
    daotask.insertTask(request.session.currentUser, task, (error, tasks) => {
        if (error) { callback(undefined, false); response.end(); }
        else {
            response.redirect("task");
        }
    })
})

app.post("/deleteCompleted", (request, response) => {
    daotask.deleteCompleted(request.session.currentUser, (error) => {
        if (error) { callback(undefined, false); response.end(); }
        else {
            response.redirect("task");
        }
    });
})

app.get("/imagenUsuario", (request, response) =>{
    daouser.getUserImageName(request.session.currentUser), (error, result) =>{
        console.log(result);
        if (error){

        }
        else{
            if(!result){
                response.sendFile(path.join(__dirname,"public/img","/NoPerfil.png"));
            }
            else{
                response.sendFile(path.join(__dirname,"public/img","/perfil.png"));
            }
        }
    }
})

app.use(comprobar);


app.listen(config.port, function (err) {
    if (err) {
        console.log("No se ha podido iniciar el servidor.");
        console.log(err);
    } else {
        console.log(`Servidor escuchando en puerto ${config.port}.`);
    }
});

