import "dotenv/config";
import app from "./src/app.js";
import connectDB from "./src/config/databse.js";
import http from "http";
import { initSocket } from "./src/sockets/server.socket.js";

const httpServer = http.createServer(app);
initSocket(httpServer);

connectDB()
.then(()=>{
    httpServer.listen(3000,()=>{
        console.log("Server is running on port 3000");

        
       
    })
})
.catch((err)=>{
    console.error("Failed to connect to the database",err);
})



