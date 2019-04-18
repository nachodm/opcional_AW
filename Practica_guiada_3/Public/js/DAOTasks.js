"use strict"

class DAOTasks{

    /**
     * Pool de conexiones a la base de datos
     * @param {*} pool 
     */
    constructor(pool){
        this.pool = pool;
    }

    /**
     * Devuelve todas las tareas del usuario especificado por parámetro.
     * 
     * @param {string} email Identificador del usuario.
     * @param {function} callback Función callback.
     */
    getAllTasks(email, callback){
        this.pool.getConnection((err, conn) => {
            if (err) {
                callback("Error de conexión a la base de datos", undefined);
            }
            conn.query("SELECT * FROM task t JOIN tag ta ON t.id = ta.taskId where t.user = ?",
            [email],
            (err, rows) => {
                conn.release();
                if (err) {
                    callback("Error de acceso a la base de datos", undefined);
                }
                var arrayResponse = [];
                
                rows.forEach(p => {
                    var object = {
                        id : p.id,
                        text: p.text,
                        done: p.done,
                        tag: p.tag
                    };
                    arrayResponse.push(object);
                });
                callback(null, arrayResponse);
                
            });
        })
    }

    insertTask(email, task, callback){
        this.pool.getConnection((err, conn)=>{
            if(err){
                callback("Error de conexión a la base de datos");
            }
            conn.query("INSERT INTO task (user, text, done) VALUES (?,?,?)", 
            [email, task.text, task.done], (err, row)=>{
               
                if(err){
                    callback("Error de acceso a la base de datos");
                }
                conn.query("INSERT INTO tag (taskId, tag) VALUES (?,?)", [row.insertId, task.tag],
                (err) =>{
                    conn.release();
                    if (err) {
                        callback("Error de acceso a la base de datos");
                    }
                    else callback(null);
                });
            });
        });
    }

    markTaskDone(idTask, callback){
        this.pool.getConnection((err, conn)=>{
            if(err){
                callback("Error de conexión a la base de datos");
            }
            conn.query("UPDATE task SET done = true WHERE id = ?",[idTask], (err) =>{
                conn.release();
                if(err){
                    callback("Error de acceso a la base de datos");
                }
                else callback(null);
            })
        })
    }

    deleteCompleted(email, callback){
        this.pool.getConnection((err, conn)=>{
            if(err){
                callback("Error de conexión a la base de datos");
            }
            conn.query("DELETE FROM task WHERE user = ? AND done = 1", [email], (err)=>{
                conn.release();
                if(err){
                    callback("Error de acceso a la base de datos");
                }
                else{
                    callback(null);
                }
            })
        })
    }
}

module.exports = DAOTasks;