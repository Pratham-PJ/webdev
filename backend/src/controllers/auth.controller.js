import { upsertStreamUser } from "../lib/stream.js";
import User from "../models/User.js"
import jwt from "jsonwebtoken"


export async function signup(req,res){
    const {email,password,fullName} = req.body;
    try {
        if(!email || !password || !fullName){
            return res.status(400).json({message:"all info must be given"});
        }
        if(password.length < 6){
             res.status(400).json({message : "Password must be at least 6 characters"});
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "Invalid email format" });
        }

        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({message : "User already exists"});
        }
        // generating random image for user we will going to use api
        //avator-placeholder.iran.liara.run
        const idx = Math.floor(Math.random()*100) + 1;
        const randomAvatar = `https://avatar-placeholder.iran.liara.run/${idx}.png`
        
        const newUser = await User.create({
            email,
            fullName,
            password,
            profilePic : randomAvatar,
        }) 

        // we have to create user in stream also
        try {
            await upsertStreamUser({
            id : newUser._id.toString(),
            name : newUser.fullName,
            image: newUser.profilePic || "",
        });
        console.log(`Stream user created for ${newUser.fullName}`);
        } catch (error) {
            console.log("Error creating Stream user",error);
        }

        const token = jwt.sign({userId : newUser._id},process.env.JWT_SECRET_KEY,{
            expiresIn : "7d"
        })

        res.cookie("jwt",token,{
            maxAge : 7*24*60*60*1000,
            httpOnly : true, // prevent xss attcks
            sameSite : "strict",
            secure : process.env.NODE_ENV === "production"
        })

        res.status(201).json({
            success:true,
            user:newUser
        })

    } catch (error) {
        console.log("Error in signup controller",error);
        res.status(500).json({message : "internal server error"});
    }
}

//login method
export async function login(req,res){
    try {
        const {email,password} = req.body;

        if(!email || !password){
            return res.status(400).json({message: "ALL fields are required"});
        }

        const user = await User.findOne({email});

        if(!user)return res.status(401).json({message: "Invalid email or password"});

        const isPasswordCorrect = await user.matchPassword(password);

        if(!isPasswordCorrect)return res.status(401).json({message:"Invalid email or password"});

        const token = jwt.sign({userId : user._id},process.env.JWT_SECRET_KEY,{
            expiresIn : "7d"
        })

        res.cookie("jwt",token,{
            maxAge : 7*24*60*60*1000,
            httpOnly : true, // prevent xss attcks
            sameSite : "strict",
            secure : process.env.NODE_ENV === "production"
        });

        res.status(200).json({
            success:true,
            user
        });

    } catch (error) {
        console.log("error in login controller",error.message);
        res.status(500).json({message : "Internal server error"});
    }
    
}

export async function logout(req,res){
    // for log out we just have to clear the cookies
    res.clearCookie("jwt");
    res.status(200).json({success : true, message : "logout successful"});
}


export async function onboard(req,res){
    try {
        const userId = req.user._id;
        const {fullName,bio,nativeLanguage,learningLanguage,location} = req.body;
        if(!(fullName && bio && nativeLanguage && learningLanguage && location)){
            return res.status(400).json({message:"All fields are required",
                missingFields : [
                    !fullName && "fullName",
                    !bio && "bio",
                    !nativeLanguage && "nativeLanguage",
                    !learningLanguage && "learningLanguage",
                    !location && "location",
                ],
            });
        }
        const updatedUser = await User.findByIdAndUpdate(userId,{
            ...req.body,
            isOnboarded : true,
        },{new:true})

        if(!updatedUser){
            return res.status(400).json({message:"User not found"});
        }

        try {
            await upsertStreamUser({
            id : updatedUser._id.toString(),
            name : updatedUser.fullName,
            image:updatedUser.profilePic || "",
        });
        console.log(`stream user updated after onboarding for ${updatedUser.fullName}`);
        } catch (streamError) {
            console.log("Error updating Stream user during onboarding :", streamError.message);
        }


        res.status(200).json({success : true,user : updatedUser});

    } catch (error) {
        console.error("Onboarding error",error);
        res.status(500).json({message:"internal server error"});
    }
}