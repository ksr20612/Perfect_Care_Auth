import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcrypt";
import { getByIdPass } from "../../services/userService.js";
import logger from "../logger.js";

const Local = () => {
    passport.use(new LocalStrategy({
        usernameField : "id",
        passwordField : "password",
    }, async (id, password, done) => {
        try {
            console.log({id, password});
            const exUser = await getByIdPass(id, password);
            console.log(exUser);
            if(exUser) {
                done(null, exUser, null);
            }else {
                done(null, null, { message : "잘못된 로그인 정보입니다."});
            }
        }catch(err) {
            logger.error(err);
            console.error(err);
            done(err);
        }
    }));
    passport.serializeUser((user, done)=>{
        done(null, user);
    });
    passport.deserializeUser((user, done)=>{
        done(null, user);
    });
}

export default Local;