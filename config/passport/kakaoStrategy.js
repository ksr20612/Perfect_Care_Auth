import passport from "passport";
import { Strategy as KakaoStrategy } from "passport-kakao";
import bcrypt from "bcrypt";
import logger from "../logger.js";
import { getById, create } from "../../services/userService.js";

const Kakao = () => {
    passport.use(new KakaoStrategy({
        clientID : process.env.KAKAO_ID,
        callbackURL : "/user/kakao/callback",
    }, async (accessToken, refreshToken, profile, done) => {
        console.log('kakao profile', profile);
        try {
            const exUser = await getById(profile.id);
            if(exUser) {
                done(null, exUser);
            }else {
                const newUser = await create({
                    email : profile._json && profile._json.kakao_account_email,
                    nick : profile.displayName,
                    snsId : profile.id,
                    provider : "kakao",
                });
                done(null, newUser);
            }
        } catch(err) {
            console.log(error);
            done(error);
        }
    }))
}