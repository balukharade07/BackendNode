import express from "express";
import cores from 'cors';
import cookieParser from 'cookie-parser';


const app = express();
app.use(cores({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));

app.use(express.json({limit: '16kb'}));
app.use(express.urlencoded({extended: true,limit: '16kb'}));
app.use(express.static("public"));
app.use(cookieParser());

// Routes

import userRouter from "./routes/user.routes.js";

//routes declerations

app.use('/api/v1/users', userRouter)

userRouter


export  { app }