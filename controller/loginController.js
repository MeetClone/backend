import prismaClient from '../config/prismaConfig.js';
import bcrypt from 'bcrypt';
import Jwt from 'jsonwebtoken';
import dotenv from 'dotenv'
dotenv.config();

export const loginGETController = (req, res) => {
    res.status(200).send(`<h1>Login Page...</h1>`)
}

export const loginPOSTController = async (req, res) => {
    const username = req.body.username
    const password =  req.body.password
    if(!username || !password){return res.status(400).json({"message" : "Username and password required"})}
    const user = await prismaClient.users.findUnique({
        where:{
            email: username
        }
    })
    if(!user){return res.status(404).json({"message" : "No user with that username is found"})}
    const hash = user.password.toString();
    bcrypt.compare(password, hash, async function(err, result) {
        // result == true
        if(err){
            console.log(err)
            return res.status(509).json({"status":"false", "message":"Error while comparing the hash"})
        }
        else{
            if(result === false){
                return res.status(401).json({"message":"Unauthorized"})
            }
            else{
                const accessToken = Jwt.sign(
                    {"email":user.email},
                    process.env.ACCESS_TOKEN_SECRET,
                    {expiresIn: '30s'}
                )
                const refreshToken = Jwt.sign(
                    {"email":user.email},
                    process.env.REFRESH_TOKEN_SECRET,
                    {expiresIn: '1d'}
                )
                const updateUser = await prismaClient.users.update({
                    where: {
                      email: user.email,
                    },
                    data: {
                      refreshToken:Buffer.from(refreshToken),
                    },
                  })
                res.cookie('jwt', refreshToken,{ httpOnly:true, maxAge:24*60*60*1000 })
                res.json({"accessToken":accessToken})
                
            }
        }
        

    });
}