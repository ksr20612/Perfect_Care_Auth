import express from "express";
import passport from "passport";
import bcrypt from "bcrypt";
import logger from "../config/logger.js";
import { isLoggedIn, isNotLoggedIn } from "./middlewares.js"; 
import { getById, create } from "../services/userService.js";
import { signNewToken } from "./token.js";

const router = express.Router();

// 회원가입
router.post("/join", isNotLoggedIn, async (req, res)=>{
    const { id, password, nick } = req.body;
    const _user = await getById(id);
    if(_user) {
        return res.status(201).json({
            code : 482,
            message : "이미 가입된 사용자입니다.",
        })
    }
    // const pwHashed = await bcrypt.hash(password, 12);
    // 생성
    const user = create({
        id,
        password,
        nick,
    });
    if(user) {
        return res.status(201).json({
            code : 201,
            id : id,
        })
    }else {
        logger.error("POST /join : fail create user");
        return next(Error("fail POST /join"));
    }
});

// 로그인
router.post("/login", isNotLoggedIn, (req, res, next)=>{
    passport.authenticate("local", (authError, user, info) => {
        if(authError) {
            logger.error(authError);
            return next(authError);
        }
        if(!user) {
            return res.json({
                code : 483,
                message : info.message,
            })
        }
        return req.login(user, async (loginError) => {
            if(loginError) {
                logger.error(loginError);
                return next(loginError);
            }else {
                const token = await signNewToken(user.id);
                if(token) {
                    console.log(token);
                    return res.status(201).json({
                        code : 201,
                        idx : user.idx,
                        id : user.userId,
                        nick : user.nickname,
                        token,
                    });
                }else {
                    logger.error("토큰 생성 실패 : " + user.id);
                    return res.json({
                        code : 484,
                        message : "[484] 로그인에 실패하였습니다.",
                    })
                }
            }

        })
    }) (req, res, next);
});

// 로그아웃
router.post("/logout", isLoggedIn, (req,res)=>{
    req.logout();
    req.session.destroy();
    res.status(201).json({
        code : 201,
    })
});

// 아이디 중복 확인
router.get("/exists/:id", async (req, res)=>{
    const id = req.params.id;
    const _user = await getById(id);
    if(_user) return true;
    return false;
});

// 카카오 로그인
router.get("/kakao", passport.authenticate("kakao"));
router.get("/kakao/callback", passport.authenticate("kakao", {
    failureRedirect : "/signin",
}), (req, res)=>{
    res.redirect("/");
})

export default router;