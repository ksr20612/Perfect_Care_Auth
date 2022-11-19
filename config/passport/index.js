import passport from "passport";
import Local from "./localStrategy.js";
// import Kakao from "./kakaoStrategy.js";
import { getById } from "../../services/userService.js";

const Passport = () => {
    passport.serializeUser((user, done)=>{
        done(null, user.id);
    });

    // passport.deserializeUser(async (id, done)=>{
    //     const user = await getById(id);
    //     if(!user) throw Error("no data"); 
    //     done(null, user);
    // })

    Local();
}

export default Passport;