"use strict"

class DAOUsers{

    /**
     * 
     * @param {*} pool 
     */
    constructor(pool){
        this.pool = pool;
    }


    isUserCorrect(email, password, callback){
        this.pool.getConnection((err, conn)=>{
            if(err){
                callback("Error de conexion con la BBDD", undefined);
            }
            conn.query("SELECT email, password FROM users WHERE email = ? AND password = ?"),
            [email, password], (err, row)=>{
                conn.release();
                if(err){
                    callback("Error de acceso a la BBDD", undefined);
                }
                if (row.length > 0) callback(undefined, true);
                else callback(undefined , false);
            }
        });
    }

    getUserImageName(email, callback){
        this.pool.getConnection((err, conn)=>{
            if(err){
                callback("Error de conexion con la BBDD", undefined);
            }
            conn.query("SELECT img FROM users WHERE email = ?", [email], (err, row)=>{
                conn.release();
                if(err){
                    callback("Error de acceso a la BBDD");
                }
                else callback(undefined, row[0]);
            });
        });
    }
}

module.exports = DAOUsers;