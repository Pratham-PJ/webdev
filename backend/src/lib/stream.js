import {StreamChat} from "stream-chat"
import "dotenv/config"

const apiKey = process.env.STEAM_API_KEY ;
const apiSecret = process.env.STEAM_API_SECRET;

if(!apiKey || !apiSecret){
    console.error("Stream API key or Secret is missing");
}

const streamClient = StreamChat.getInstance(apiKey,apiSecret); 

export const upsertStreamUser = async (userData) => {
    try {
        //upsertUsers means create user if not exist and update if exist
        await streamClient.upsertUsers([userData]);
        return userData;
    } catch (error) {
    console.error("error upserting stream user :",error);        
    }
};

export const generateStreamToken = (userId) => {};