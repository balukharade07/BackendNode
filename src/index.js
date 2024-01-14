// require('dotenv').config({path: './env'});
import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";
dotenv.config({
  path: "./env",
});

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log("Server is running at port " + process.env.PORT);
    });
  })
  .catch((err) => {
    console.error("Mongo Db Failed", err);
  });

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
