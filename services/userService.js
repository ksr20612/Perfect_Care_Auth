import logger from "../config/logger.js";

const tempData = [
    {
        id : "test",
        password : "1234",
        name : "ethan"
    }, 
    {
        id : "test2",
        password : "4321",
        name : "ethan2"
    },
    {
        id : "kakao",
        password : "kakao",
        provider : "kakao",
    }
]

const getById = async (id) => {
    for(const user of tempData) {
        if(user.id === id) {
            return user;
        }
    }
    logger.error(`userService getById : no data matched ${id}`);
    return null;
}
const create = async (newUser) => {
    try {
        tempData.push(newUser);
        return newUser;
    } catch(e) {
        logger.error(`userService create : fail create user "${newUser.id || null}"`);
        return false;
    }
}

export { getById, create };