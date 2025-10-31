import dotenv from "dotenv";
import connectDB from "./DB/index.js";
import app from "./app.js";

dotenv.config({
    path: "./.env"
});
connectDB()
.then(()=>{
    server.on("Error",(error)=>{
        console.log("Error",error);
    })
    app.listen(process.env.PORT || 8000, ()=>{
        console.log(`Server is running at the PORT ${process.env.PORT}`);
        
    })
})
.catch((error)=>{
    console.log("Mongoo connection DB is Failed !!", error);
    
})

















/*import express from "express"

const app = express()

(
    async () => {
        try {
            await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
                app.on("error",(error)=>{
                    console.log(`App is listening on port ${process.env.PORT}`);
                    throw error
                })
                app.listen(process.env.PORT,()=>{
                    console.log(`App is listening on port ${process.env.PORT}`);
                })

        }catch (error){
            console.log("ERROR",error);
            throw error
        }
    }
)()

*/