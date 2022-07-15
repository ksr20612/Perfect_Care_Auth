import passport from "passport";
import local from "./localStrategy.js";
import kakao from "./kakaoStrategy.js";
import { getById } from "../../services/userService.js";

const Passport = () => {
    passport.serializeUser((user, done)=>{
        done(null, user.id);
    });

    passport.deserializeUser((id, done)=>{
        const user = await getById(id);
        if(!user) throw Error("no data"); 
        done(null, user);
    })
}

export default Passport;