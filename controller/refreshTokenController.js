import Jwt from 'jsonwebtoken';
import dotenv from 'dotenv'
import prismaClient from '../config/prismaConfig.js';
dotenv.config();

export const refreshTokenController = async (req, res) => {
    const cookies =  req.cookies
    console.log(cookies)
    if(!cookies?.jwt){return res.sendStatus(401)};
    const refreshToken = cookies.jwt;
    
    // const user = await prismaClient.users.findUnique({
    //     where:{
    //         refreshToken: bufferForm
    //     }
    // })
    
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
            if(!user){return res.sendStatus(403);} //forbidden
            
            if(user.refreshToken.toString() !== refreshToken){return res.sendStatus(408);}
            const accessToken = Jwt.sign(
                {"email":decoded.email},
                process.env.ACCESS_TOKEN_SECRET,
                {expiresIn: '1h'}
            );
            res.json({ newaccessToken });
        }
    )
}