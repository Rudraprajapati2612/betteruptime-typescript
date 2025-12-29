import "dotenv/config"
import express from  "express"
const  app = express();
import { prisma } from "db/client";
app.use(express.json())


console.log(process.env.DATABASE_URL);

app.post("/website",async (req,res)=>{
    if(!req.body.url){
        res.status(411).json({})
        return  
    }
    const website = await prisma.website.create({
        data:{
            url: req.body.url,
            timeAdded : new Date()
        }
    })

    res.json({
        message : "Website is added",
        id : website.id
    })
})


app.listen(3000,()=>{
    console.log("Server is running on port 3000");
    
})