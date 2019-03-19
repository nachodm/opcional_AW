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
                    var object = {
                        id = p.id,
                        text = p.text,
                        done = p.done,
                        tags = p.tags
                    }
                    arrayResponse.push(object);
                });
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
                conn.release();
                if(err){
                    callback("Error de acceso a la BBDD");
                }
                conn.query("INSERT INTO tag (tag) VALUES (?)", [task.tag],
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
}