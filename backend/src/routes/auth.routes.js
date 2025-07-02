import express from "express"
import {signup,login,logout} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { onboard } from "../controllers/auth.controller.js";

const router = express.Router()

router.post("/signup",signup)

router.post("/login",login)

router.post("/logout",logout)

// after signup only you can visit this page
router.post("/onboarding", protectRoute , onboard)

// this below routes is made to check whether you are authenticated or not
router.get("/me",protectRoute,(req,res)=>{
    res.status(200).json({success:true,user:req.user});
})

export default router;