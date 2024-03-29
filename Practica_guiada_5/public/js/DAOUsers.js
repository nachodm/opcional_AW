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
      
            conn.query("SELECT email, password FROM user WHERE email = ? AND password = ?",
            [email, password], (err, row)=>{
                
                conn.release();
                if(err){
                    callback("Error de acceso a la BBDD", undefined);
                }
                if (row.length > 0) callback(null, true);
                else callback("La correo/contraseña son incorrectos" , false);
            });
        });
    }

    getUserImageName(email, callback){
        this.pool.getConnection((err, conn)=>{
            if(err){
                callback("Error de conexion con la BBDD", undefined);
            }
            conn.query("SELECT img FROM user WHERE email = ?", [email], (err, row)=>{
                conn.release();
                if(err){
                    callback("Error de acceso a la BBDD", null);
                }
                else {
                    console.log(row[0]);
                    callback(null, row[0]);
                }
            });
        });
    }

}

module.exports = DAOUsers;