import mysql from "mysql2/promise";

const connOptions = {
    host : "localhost",
    port : "3306",
    user : process.env.DB_USER,
    password : process.env.DB_PASSWORD,
    database : process.env.DB_DATABASE,
    connectionLimit : 50,
    multipleStatements : true,
}

let connPool = null;
const connect = () => {
    if(!connPool) {
        connPool = mysql.createPool(connOptions);
    }
    return connPool;
}

export const query = async (querylang, { onSuccess = f=>f, onFail = f=>f }) => {
    try {
        const connection = await connect().getConnection(async conn=>conn);
        try {
            const [rows] = await connection.query(querylang);
            connection.release();
            if(onSuccess) onSuccess();
            return [rows];
        } catch(err) {
            console.log(err);
            logger.error(err);
            connection.release();
            return onFail && onFail() ;
        }
    }catch(err) {
        console.log("DB connection error");
        logger.error(err);
        return false
    }
}