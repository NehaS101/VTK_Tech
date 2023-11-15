import connection from "./config";
import express from "express";
import dotenv from "dotenv";
import router from "./Routes/route";
dotenv.config();

const app = express();
app.use(express.json());
app.use('/api',router);

app.listen(process.env.port,async()=>{
    console.log("server listening on port " + process.env.port);
    try {
      await connection;
      console.log('connected to db')  
    } catch (error) {
        console.log("server error: " + error)
    }
    
})