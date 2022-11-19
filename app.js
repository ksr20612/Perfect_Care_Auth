import "dotenv/config";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import favicon from "serve-favicon";
import path from "path";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import session from "express-session";
import compression from "compression";
import logger from "./config/logger.js";

// passport 관련
import passport from "passport";
import passportConfig from "./config/passport/index.js";

// api 관련
import defaultRouter from "./api/index.js"
import tokenRouter from "./api/token.js";
import userRouter from "./api/user.js";

(async () => {

    const app = express();
    passportConfig();

    // favicon
    const __dirname = path.resolve();
    app.use(favicon(path.join(__dirname, "/favicon.ico")));

    // port
    app.set("port", process.env.PORT || 4000);

    // cors - temp
    app.use(cors({
        origin : "http://localhost:3000", // default react server
        credentials : true,
    }));

    // public
    app.use(express.static("../home/template"));

    // middlewares
    app.use(compression());
    app.use(express.json());
    app.use(express.urlencoded({extended : false}));
    app.use(morgan('dev'));
    app.use("/",express.static(path.join(__dirname, 'public')));
    app.use(cookieParser(process.env.COOKIE_CODE));
    app.use(session({
        resave : false,
        saveUninitialized : false,
        secret : process.env.COOKIE_CODE,
        cookie : {
            httpOnly : true,
            secure : false,
        },
        name : "session-cookie",
    }));
    app.use(passport.initialize());
    app.use(passport.session());

    // routing(token)
    // app.use("/", defaultRouter);
    app.use("/user", userRouter);   // 회원 가입 관련
    app.use("/token", tokenRouter); // 토큰 관련

    // http(임시), 추후에 https로 교체할 것
    const server = app.listen(app.get("port"), ()=>{
        const today = new Date();
        console.log(`[${today.toLocaleString()}] ${app.get('port')} 포트에서 서버 작동을 시작합니다.`);
        logger.info(`SERVER STARTS`);
    })

})();


