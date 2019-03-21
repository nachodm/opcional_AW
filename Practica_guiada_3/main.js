"use strict";

const mysql = require("mysql");
const config = require("./config");
const DAOUsers = require("./Public/js/DAOUsers");
const DAOTasks = require("./Public/js/DAOTasks");

// Crear el pool de conexiones
const pool = mysql.createPool({
    host: config.host,
    user: config.user,
    password: config.password,
    database: config.database
});

let daoUser = new DAOUsers(pool);
let daoTask = new DAOTasks(pool);

// Definición de las funciones callback
// Uso de los métodos de las clases DAOUsers y DAOTasks

  
daoUser.isUserCorrect("usuario@ucm.es", "mypass", cb_isUserCorrect); //Usuario correcto y contraseña correcta

function cb_isUserCorrect(err, result){
   if (err) {
       console.log(err.message);
   } else if (result) {
       console.log("Ejecutando isUserCorrect --> Usuario y contraseña correctos");
   } else {
       console.log("Ejecutando isUserCorrect --> Usuario y/o contraseña incorrectos");
   }
}

daoUser.getUserImageName("usuario@ucm.es", cb_getUserImageName);

function cb_getUserImageName(err, result){
    if (err) {
        console.log(err.message);
    } else if (result) {
        console.log("Ejecutando getUserImageName --> El nombre es: " + result.img);
    } else {
        console.log("Ejecutando getUserImageName --> No se ha podido coger el nombre");
    }
}

daoTask.getAllTasks("usuario@ucm.es", cb_getAllTasks);

function cb_getAllTasks(err, result){
    if (err) {
        console.log(err.message);
    } else if (result) {
        console.log("Ejecutando getAllTasks --> Las Tareas son: " );
        console.log(result);
    } else {
        console.log("Ejecutando getAllTasks --> No se ha podido coger las tareas");
    }
}

var task = {
    text: "hacer la compra",
    done: false,
    tag: "personal"
}
daoTask.insertTask("usuario@ucm.es", task, cb_insertTask);

function cb_insertTask(err, result){
    if (err) {
        console.log(err.message);
    } else if (result) {
        console.log("Ejecutando insertTasks --> Tarea insertada");
    } else {
        console.log("Ejecutando insertTasks --> No se ha podido insertar la tareas");
    }
}

daoTask.markTaskDone("1", cb_markTaskDone);

function cb_markTaskDone(err, result){
    if (err) {
        console.log(err.message);
    } else if (result) {
        console.log("Ejecutando markTaskDone --> Tarea marcada done");
    } else {
        console.log("Ejecutando markTaskDone --> No se ha podido marcar la tareas");
    }
}

daoTask.deleteCompleted("usuario@ucm.es", cb_deleteCompleted);

function cb_deleteCompleted(err, result){
    if (err) {
        console.log(err.message);
    } else if (result) {
        console.log("Ejecutando deleteCompleted --> Tarea eliminada");
    } else {
        console.log("Ejecutando deleteCompleted --> No se ha podido eliminar la tareas");
    }
}