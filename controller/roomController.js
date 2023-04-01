import redisClient from "../config/redisConfig.js";
import Jwt  from "jsonwebtoken";
import dotenv from  'dotenv';
dotenv.config();
const DEFAULT_EXPIRATION_TIME = 24*60*60;
await redisClient.connect();

export const roomController = async (req,res)=>{
    
    const meetId = req.body.meetId;
    const authHeader = req.headers.authorization || req.headers.Authorization;
    const accessToken = authHeader.split(' ')[1];
    Jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
        if (err) {
            return res.sendStatus(403); // invalid token
        } else {
            try{
                const email = decoded.email;
                
                await redisClient.rPush(meetId,  email)
                res.sendStatus(204)
            }
            catch(err){
                console.log(err);
                res.sendStatus(509);
            }
            
        }
    }
    );
}