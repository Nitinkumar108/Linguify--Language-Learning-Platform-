import {StreamChat} from 'stream-chat';
import "dotenv/config";

const apiKey = process.env.STEAM_API_KEY;
const apiSecret = process.env.STEAM_API_SECRET;

if(!apiKey || !apiSecret)
{
    console.error("Stream Api Key or Secret is missing");
}

const streamClient = StreamChat.getInstance(apiKey,apiSecret);
export const upsertStreamUser =async (userData)=>{
    try {
        await streamClient.upsertUsers([userData]);
        return userData;
    } catch (error) {
        console.error("Error upserting Stream user",error);
    }
}
// todo
export const generateStreamToken =(userId)=>{
    try {
       //ensure userId is a string
       const userIdstr=userId.toString();
       return streamClient.createToken(userIdstr);
    } catch (error) {
        console.error("Error generating Stream token", error);
    }
};

