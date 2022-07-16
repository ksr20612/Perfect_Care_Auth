import express from "express";
import passport from "passport";
import bcrypt from "bcrypt";
import logger from "../config/logger.js";
import { isLoggedIn, isNotLoggedIn } from "./middlewares.js"; 
import { getById, create } from "../services/userService.js";

const router = express.Router();

// nunjucks 접근
// router.use((req, res, next)=>{
//     res.locals.user = req.user;
// })

// 회원가입
router.post("/join", isNotLoggedIn, async (req, res)=>{
    const { id, password, name, nick, gender, age, residence, fromWhere, isForResearch } = req.body;
    const _user = await getById(id);
    if(_user) {
        return res.status(482).json({
            code : 482,
            message : "이미 가입된 사용자입니다.",
        })
    }
    const pwHashed = await bcrypt.hash(password, 12);
    // 생성
    const user = create({
        id,
        password : pwHashed,
        name,
        nick,
        gender,
        age,
        residence,
        fromWhere,
        isForResearch
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
router.post("/login", isNotLoggedIn, (req, res)=>{
    passport.authenticate("local", (authError, user, info) => {
        if(authError) {
            logger.error(authError);
            return next(authError);
        }
        if(!user) {
            return res.status(483).json({
                code : 483,
                message : info.message,
            })
        }
        return req.login(user, (loginError) => {
            if(loginError) {
                logger.error(loginError);
                return next(loginError);
            }
            return res.status(201).json({
                code : 201,
                id : user.id,
            });
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

export default router;