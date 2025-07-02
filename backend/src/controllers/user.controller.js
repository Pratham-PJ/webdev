import User from "../models/User.js";
import FriendRequest from "../models/FriendRequest.js";


export async function getRecommendedUsers(req,res){
    try {
        const currentUserId = req.user.id;
        const currentUser = req.user
        const recommendedUsers = await User.find({
            $and:[
                {_id : {$ne:currentUserId}},//exclude current user
                {$id:{$nin:currentUser.friends}},//exclude current user's friends
                {isOnboarded:true}
            ]
        });
        res.status(200).json({success:true,recommendedUsers});

    } catch (error) {
        console.error("error in getRecommended Users controller",error.message);
        res.status(500).json({message:"internal server Error"});
    }
};
export async function getMyFriends(req,res){
    try {
        const user = await User.findById(req.user.id)
        .select("friends")
        .populate("friends","fullName profilePic nativeLanguage learningLanguage");

        res.status(200).json(user.friends);
    } catch (error) {
        console.error("error in getmyfrinde controller",error.message);
        res.status(500).json({message:"internal server error"});
    }
};

export async function sendFriendRequest(req,res){
    try {
        const myId = req.user.id;
        const {id:recipentId} = req.params;

        //prevent sending req to yourself
        if(myId === recipentId){
            return res.status(400).json({message:"You can't send friend request to yourself"});
        }

        const recipent = await User.findById(recipentId)
        if(!recipent){
            return res.status(404).json({message:"Recipient not found"});
        }

        // check if user is already friend
        if(recipent.friends.includes(myId)){
            return res.status(400).json({message:"You are already friends with ths user"});
        }

        // check if a req already exists
        const existingRequest = await sendFriendRequest.findOne({
            $or:[
                {sender:myId, recipient :recipentId},
                {sender:recipientId, recipient : myId},
            ],
        });

        if(existingRequest){
            return res
            .status(400)
            .json({message:"A friend request already exists between you and this user"});
        }

        const friendRequest = await FriendRequest.create({
            sender : myId,
            recipient : recipentId,
        });
        res.status(201).json(friendRequest)
    } catch (error) {
        console.error("error is sendFriendrequest controller",error.message);
        res.status(500).json({message:"internal server error"});
    }
};