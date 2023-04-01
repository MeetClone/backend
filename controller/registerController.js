import bcrypt from 'bcrypt';
import prismaClient from "../config/prismaConfig.js";

export const registerGETController = (req, res) => {
    res.status(200).send(`<h1>Register Page...</h1>`)
}

export const registerPOSTController = async (req, res) => {
    const username = req.body.username;
    const passwd = req.body.password;
    const saltRounds = 12;
    // const hash = bcrypt.hash(passwd,12)
    if(!username || !passwd){return res.status(400).json({"message" : "Username or password is required"})}
    //checking for duplicates usernames/emails
    // console.log(username)
    // console.log(passwd)
    const user = await prismaClient.Users.findUnique({
        where: {
          email: username
        },
      })
    // console.log(user)
    if(user){ return res.status(409).json({"message" : "User already exists"})}
    
        bcrypt.hash(passwd, saltRounds, async function(err, hash) {
            // Store hash in your password DB.
            if(err){
                console.log("Error while hashing !!!")
                return res.status(509).json({"message":"Error while hashing the password"})
            }
            else{

            try{
                const newUser = { 
                    email: username,
                    password: Buffer.from(hash)
                }
                const response = await prismaClient.Users.create({ data: newUser })
                console.log(response)
                return res.status(201).json({'success': true, 'message': 'user registered successfully!'})
            }
            
            catch(err){
                console.log(err);
                return res.status(505).json({"success": "false", "message": "error while registering new user"})
            }
 } });
        
    
    
}