import express from "express";
import jwt from "jsonwebtoken";
import logger from "../config/logger.js";

const router = express.Router();
router.post("/", (req, res)=>{
    console.log(req.body);
    try {
        jwt.verify(req.body.userToken, process.env.JWT_SECRET);
    } catch(err) {
        if(err.name === "TokenExpiredError") {
            logger.error(`POST /token : token expired`);
            return res.status(499).json({
                code : 499,
                message : "토큰이 만료되었습니다.",
            })
        }
        logger.error(`POST /token : invalid token`);
        return res.status(401).json({
            code : 401,
            message : "유효하지 않은 토큰입니다.",
        })
    }

    return res.status(201).json({
        code : 201,
        isValid : true,
    })
})

export default router;