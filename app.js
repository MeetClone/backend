// const createError = require('http-errors');
// const cookieParser = require('cookie-parser');
import express from 'express';
import logger from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import verifyJWT from './middleware/verifyJWT.js';
import corsOptions from './config/corsOptions.js';
import credentials from './middleware/credentials.js';
import login from './routes/login.js';
import register from './routes/register.js';
import errorHandler from './middleware/errorHandler.js';
import refresh from './routes/refresh.js';
import logout from './routes/logout.js'
import room from './routes/room.js'

const app = express()

// middleware for logging purposes
app.use(logger('tiny'))

// middleware for Access Control Allow Origin, to be called before cors
app.use(credentials);

// middleware to allow cors only to specific whitelisted origins based on options
app.use(cors(corsOptions));

// middleware to handle incoming json payload
app.use(express.json());

// middleware to handle incoming url encoded form data
app.use(express.urlencoded({ extended: false }));

// middleware to handle cookies being sent and received
app.use(cookieParser());

// public routes
app.use('/login', login);
app.use('/register', register);
app.use('/refresh', refresh);
app.use('/logout', logout);

// verifyJWT middleware
app.use(verifyJWT);

// protected routes
app.use('/room', room);


// middleware to handle errors
app.use(errorHandler);

const PORT = 9000 || process.env.PORT;

app.listen(PORT, ()=>{
  console.log(`SERVER IS LISTENING IN PORT ${PORT}`)
})
