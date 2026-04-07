import "dotenv/config";
import app from "./src/app.js";
import connectDB from "./src/config/databse.js";
import { testai } from "./src/services/ai.service.js";

connectDB()
.then(()=>{
    app.listen(3000,()=>{
        console.log("Server is running on port 3000");

        testai()
        .then((response) => {
            console.log("Gemini test response:", response);
        })
        .catch((error) => {
            console.error("Gemini test failed:", error.message);
        });
    })
})
.catch((err)=>{
    console.error("Failed to connect to the database",err);
})



