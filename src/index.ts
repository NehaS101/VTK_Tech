import connection from "./config";
import express from "express";
import dotenv from "dotenv";
import authenticate from "./Middleware/auth";
import router from "./Routes/bookroute";
import userRouter from "./Routes/userroutes";
dotenv.config();

const app = express();
app.use(express.json());
app.use('/api',router);
app.use('/api',userRouter);

app.get('/',(req, res) => {
res.send('wecome to library app');
});

app.listen(process.env.Port,async()=>{
    console.log("server listening on port " + process.env.Port);
    try {
      await connection;
      console.log('connected to db')  
    } catch (error) {
        console.log("server error: " + error)
    }
    
})