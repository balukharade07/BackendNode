// require('dotenv').config({path: './env'});
import dotenv from 'dotenv';
import connectDB from "./db/index.js";
dotenv.config({
    path: './env'
})

connectDB();


/*
import express from "express";

const app = express();
( async () => {
    try {
       await mongoose.connect(`${process.env.MONGOBD_URL}/${DB_NAME}`);
       app.on("error", (error) => {
        console.error(error);
        throw error
       });

       app.listen(process.env.PORT, (next) => {
        console.log(`Appliaction listen on ${process.env.PORT}`);
        // next();
       })
    } catch (error) {
        console.error(error);
        throw error;
    }
})*/