import Jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const verifyJWT = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    // if authHeader does not exist return 401 unauthorized error -> Bearer Token
    if (!authHeader) {
        return res.sendStatus(401);
    } else {
        const token = authHeader.split(' ')[1];
        // asynchronous version --> callback specified
        Jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
            if (err) {
                return res.sendStatus(403); // invalid token
            } else {
                try{
                    req.email = decoded.email;
                    next();
                }
                catch(err){
                    console.log(err);
                }
                
            }
        }
        );
    }
}

export default verifyJWT;