import express from "express";
import path from "path";

const __dirname = path.resolve();
const router = express.Router();
router.get("/", (req, res)=>{
    console.log(`TEST ON ${req.ip}`);
    const today = new Date();
    return res.status(200).json({
        code : 200,
        time : today.toLocaleString(),
        ip : req.ip
    })
})

export default router;