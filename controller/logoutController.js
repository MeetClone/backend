import prismaClient from '../config/prismaConfig.js';
import dotenv from 'dotenv';
dotenv.config();
import Jwt  from 'jsonwebtoken';

export const logoutController = async (req, res) => {
    const cookies =  req.cookies
    if(!cookies?.jwt){return res.sendStatus(204)}; //no content to send
    const refreshToken = cookies.jwt;
    //verifying jwt
    Jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        async (err,decoded)=>{
            if(err){return res.sendStatus(403);}
            const user =  await prismaClient.users.findUnique({
                where:{
                    email:decoded.email
                }
            })
            if(!user){
                res.clearCookie('jwt', refreshToken,{ httpOnly:true})
                return res.sendStatus(204);
            } //no content
            
            await prismaClient.users.update({
                where: {
                  email: decoded.email,
                },
                data: {
                  refreshToken: null,
                },
              })
            res.clearCookie('jwt', refreshToken,{ httpOnly:true})
            return res.sendStatus(204);
              
        }
    )
}