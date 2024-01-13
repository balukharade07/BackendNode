import express from "express";
import cores from 'cors';
import cookiesParser from 'cookies-parser'

const app = express();
app.use(cores({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));

app.use(express.json({limit: '16kb'}));
app.use(express.urlencoded({extended: true,limit: '16kb'}));
app.use(express.static("public"))


export  { app }