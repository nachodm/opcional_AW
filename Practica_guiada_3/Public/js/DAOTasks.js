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
            conn.query("SELECT * FROM task t LEFT JOIN tag ta ON t.id = ta.taskId where t.user = ? ORDER BY id ASC;",
            [email],
            (err, rows) => {
                conn.release();
                if (err) {
                    callback("Error de acceso a la base de datos", undefined);
                }

                let tasks = [], id, text, done, tags = [], add = false;

                rows.forEach(row => {
                    if (id !== row.id) {
                        if (add) {
                            tasks.push({ id: id, text: text, done: done, tags: tags });
                            tags = [];
                        }
                        id = row.id;
                        text = row.text;
                        done = row.done;
                        add = true;
                    }
                    if (row.tag !== null){
                        tags.push(row.tag);
                    }
                })
                /**Último elemento */
                if (rows.length > 0) { 
                    tasks.push({ id: id, text: text, done: done, tags: tags }); 
                }
                callback(null, tasks);
            });
        })
    }

    insertTask(email, task, callback){
        let separation = task.text.split(" @");

        this.pool.getConnection((err, conn)=>{
            if(err){
                callback("Error de conexión a la base de datos");
            }
            conn.query("INSERT INTO task (user, text, done) VALUES (?,?,?)", 
            [email, separation[0], task.done], (err, row)=>{
               
                if(err){
                    callback("Error de acceso a la base de datos");
                }
                if (separation.length > 1) {
                    for (let i = 1; i < separation.length; i++) {
                        conn.query("INSERT INTO tag (taskId, tag) VALUES (?,?)", [row.insertId, separation[i]],
                        (err) =>{
                            if (err) {
                                callback("Error de acceso a la base de datos");
                            }
                        });
                    }
                    conn.release();
                }
                callback(null);
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
