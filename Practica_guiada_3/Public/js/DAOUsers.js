"use strict"

class DAOUsers{

    /**
     * Inicializa el DAO de usuarios.
     * 
     * @param {Pool} pool Pool de conexiones MySQL. Todas las operaciones
     *                    sobre la BD se realizarán sobre este pool.
     */
    constructor(pool){
        this.pool = pool;
    }

    /**
     * Determina si un determinado usuario aparece en la BD con la contraseña
     * pasada como parámetro.
     * 
     * @param {string} email Identificador del usuario a buscar
     * @param {string} password Contraseña a comprobar
     * @param {function} callback Función que recibirá el objeto error y el resultado
     */
    isUserCorrect(email, password, callback){
        this.pool.getConnection((err, conn) => {
            if (err) {
                callback("Error de conexión con la BBDD", undefined);
            }
      
            conn.query("SELECT email, password FROM user WHERE email = ? AND password = ?",
            [email, password], 
            (err, rows)=>{
                conn.release();
                if(err){
                    callback("Error de acceso a la BBDD", undefined);
                }
                if (rows.length > 0) callback(null, true);
                else callback(null, false);
            });
        });
    }

    /**
     * Obtiene el nombre del fichero que contiene la imagen de perfil de un usuario.
     * 
     * 
     * @param {string} email Identificador del usuario cuya imagen se quiere obtener
     * @param {function} callback Función que recibirá el objeto error y el resultado
     */
    getUserImageName(email, callback){
        this.pool.getConnection((err, conn) => {
            if (err) {
                callback("Error de conexión con la BBDD", undefined);
            }
            conn.query("SELECT img FROM user WHERE email = ?",
            [email],
            (err, row)=>{
                conn.release();
                if (err) {
                    callback("Error de acceso a la BBDD");
                }
                if (row.length === 0) {
                    callback(null, undefined);
                } else {
                    callback(null, row[0].img);
                }
            });
        });
    }

}

module.exports = DAOUsers;