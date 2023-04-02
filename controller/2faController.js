import prismaClient from '../config/prismaConfig.js';
import dotenv from 'dotenv';
dotenv.config();
import Jwt  from 'jsonwebtoken';
import speakeasy from 'speakeasy';
import QRCode  from 'qrcode';

export const twofaController = async (req, res) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader) {
        return res.sendStatus(401);//Unauthorized
    } else {
        const token = authHeader.split(' ')[1];
        // asynchronous version --> callback specified
        Jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
            if (err) {
                return res.sendStatus(403); // invalid token
            } else {
                try{
                    const email = decoded.email;
                    const secret = speakeasy.generateSecret({
                        name:"MeetClone2FactorAuth:)"
                    });
                    const updateUser = await prismaClient.users.update({
                        where: {
                          email: email,
                        },
                        data: {
                            user_secret_2fa:secret.base32,
                        },
                      })
                    
                    QRCode.toDataURL(secret.otpauth_url, function(err, data_url) {
                        // console.log(data_url);
                        if(err){
                            console.log(err);
                            return res.sendStatus(403);
                        }
                        res.status(200).json({"qr_user":data_url})
                      });


                }
                catch(err){
                    console.log(err);
                }
                
            }
        }
        );
    }
}