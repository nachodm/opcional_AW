"use strict"

class DAOTasks{

    /**
     * 
     * @param {*} pool 
     */
    constructor(pool){
        this.pool = pool;
    }

    getAllTasks(email, callback){
        this.pool.getConnection((err, conn)=>{
            if(err){
                callback("Error de conexion a la BBDD");
            }
            conn.query("SELECT * FROM task t JOIN tag ta ON t.id = ta.taskId where t.user = ?",[email],
            (err, rows)=>{
                conn.release();
                if(err){
                    callback("Error de acceso a la BBDD");
                }
                var arrayResponse = [];
                
                rows.forEach(p => {
                    if(arrayResponse.length > 0 && checkID(p.id, arrayResponse)){
                        var pos = getObject(p.id, arrayResponse);
                        arrayResponse[pos].tag.push(p.tag);
                    }
                    else{
                        var object = {
                            id : p.id,
                            text: p.text,
                            done: p.done,
                            tag: []
                        };
                        object.tag.push(p.tag);
                        arrayResponse.push(object);
                    }
                });
                callback(undefined, arrayResponse); 
            });
        })
    }

    insertTask(email, task, callback){
        this.pool.getConnection((err, conn)=>{
            if(err){
                callback("Error de conexion a la BBDD");
            }
            conn.query("INSERT INTO task (user, text, done) VALUES (?,?,?)", 
            [email, task.text, task.done], (err, row)=>{
               
                if(err){
                    callback("Error de acceso a la BBDD");
                }
                conn.query("INSERT INTO tag (taskId, tag) VALUES (?,?)", [row.insertId, task.tag],
                (err) =>{
                    conn.release();
                    if(err){
                        
                        callback(undefined, false);
                    }
                    else callback(undefined, true);
                });
            });
        });
    }

    markTaskDone(idTask, callback){
        this.pool.getConnection((err, conn)=>{
            if(err){
                callback("Error de conexion a la BBDD");
            }
            conn.query("UPDATE task SET done = true WHERE id = ?",[idTask], (err) =>{
                conn.release();
                if(err){
                    callback("Error de acceso a la BBDD");
                }
                else callback(undefined, true);
            })
        })
    }

    deleteCompleted(email, callback){
        this.pool.getConnection((err, conn)=>{
            if(err){
                callback("Error de conexion a la BBDD", false);
            }
            conn.query("DELETE FROM task WHERE user = ? AND done = 1", [email], (err)=>{
                conn.release();
                if(err){
                    callback("Error de acceso a la BBDD", false);
                }
                else{
                    callback(undefined, true);
                }
            })
        })
    }
}

function checkID(id, arrayResponse){
    var encontrado = false;
    var i = 0; 
    console.log(arrayResponse[0]);
    while(!encontrado && i <arrayResponse.length){
        if(arrayResponse[i].id == id) return true;
        ++i;
    }
    return false;
}

function getObject(id, arrayResponse){
    var i = 0;
    while(i < arrayResponse.length){
        if(arrayResponse[i].id == id) return i;
        ++i;
    }
    return null;
}
module.exports = DAOTasks;