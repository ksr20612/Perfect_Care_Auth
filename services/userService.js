import logger from "../config/logger.js";
import { query } from "../models/mysql.js";

const getById = async (id) => {
    try {
        const sql = `select * from users where userId = '${id}'`;
        logger.info(`${id} : ${sql}`);
        const [result] = await query(sql, {});
        if(result.length > 0) {
            return result[0];
        }else {
            throw Error("no data matched!");
        }
    } catch(err) {
        return false;
    }
}
const getByIdPass = async (id, password) => {
    try {
        const sql = `select * from users where userId = '${id}' and password = '${password}';`;
        logger.info(`${id} : ${sql}`);
        const [result] = await query(sql, {});
        if(result.length > 0) {
            return result[0];
        }else {
            throw Error("no data matched!");
        }
    } catch(err) {
        logger.error(`userService getByIdPass : no data matched ${id}`);
        return null;
    }
}
const create = async ({id, password, nick}) => {
    try {
        const sql = `insert into users(userId, password, nickname) values ('${id}', '${password}', '${nick}');`
        logger.info(`${id} : ${sql}`);
        const [result] = await query(sql, {});
        if(result) {
            return true;
        }else {
            throw Error("no data matched!");
        }
    } catch(e) {
        logger.error(`userService create : fail create user "${id}"`);
        return false;
    }
}

export { getById, getByIdPass, create };