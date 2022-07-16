import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcrypt";
import { getById } from "../../services/userService.js";
import logger from "../logger.js";

const Local = () => {
    passport.use(new LocalStrategy({
        usernameField : "id",
        passwordField : "password",
    }, async (id, password, done) => {
        try {
            const exUser = await getById(id);
            if(exUser) {
                const result = await bcrypt.compare(password, exUser.password);
                if(result) {
                    done(null, exUser);
                }else {
                    done(null, null, { message : "비밀번호가 일치하지 않습니다."});
                }
            }else {
                done(null, null, { message : "가입되지 않은 아이디입니다."});
            }
        }catch(err) {
            logger.error(err);
            console.error(err);
            done(err);
        }
    }));
}

export default Local;