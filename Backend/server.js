import app from "./src/app.js";
import dotenv from "dotenv";
import connectDB from "./src/config/databse.js";


dotenv.config();

connectDB()
.then(()=>{
    app.listen(3000,()=>{
        console.log("Server is running on port 3000");
    })
})
.catch((err)=>{
    console.error("Failed to connect to the database",err);
})



