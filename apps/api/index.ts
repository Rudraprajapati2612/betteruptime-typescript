import "dotenv/config"
import express from  "express"
import bcrypt from "bcrypt";
const  app = express();
import { prisma } from "db/client";
import { AuthInput } from "./types";
import cors from  "cors";
import jwt from "jsonwebtoken";
import { authMiddleWare } from "./middleware";
app.use(express.json())
app.use(cors())

console.log(process.env.DATABASE_URL);

app.post("/website" , authMiddleWare,async (req,res)=>{
    if(!req.body.url){
        res.status(411).json({})
        return  
    }
    
    const website = await prisma.website.create({
        data:{
            url: req.body.url,
            timeAdded: new Date(),
            userId : req.userId!
        }
    })
    res.json({
        message : "Website is added",
        id : website.id
    })
})

app.get("/status/:websiteId",authMiddleWare,async(req,res)=>{
  
  try{
    console.log("Before log ");
    
    const webite = await prisma.website.findFirst({
      where:{
        userId : req.userId!,
        id : req.params.websiteId
      },
      include:{
        tickes:{
          orderBy :[{
            createdAt: 'desc'
          }],
          take : 10
        }
      }
    })
    
    console.log("After log");
    
    if(!webite){
      return res.status(403).json({
        message : "not found"
      })
    }
    res.json({
      url : webite.url,
      id : webite.id,
      user_id : webite.userId
    })
    
  }catch(e){
    res.status(403).json({
      message: "error"
    })
  }
})

app.post("/user/signup",async (req,res)=>{
    try{
          const data = AuthInput.safeParse(req.body);
              if(!data.success){
                res.status(403).send("")
                return;
              }
              
              
              const hassedPassword = await bcrypt.hash(data.data.password, 10);
              
            const user = await prisma.user.create({
              data:{
                username : data.data.username,
                password:hassedPassword
              }
            })
                
          res.status(200).json({
            id :user.id
          })
 }
  catch(e){
    res.status(403).send(e)
  }
})

app.post("/user/signin",async(req,res)=>{
  try {
    const data = AuthInput.safeParse(req.body);
    if (!data.success) {
      res.status(403).send("")
      return;
    }
  
    const username = data.data.username
    const user = await prisma.user.findUnique({
      where: {
        username
      }
    })
  
  
    if (!user || !user.password) {
      return res.status(403).send("");
    }
  
  
    const isValidUser = await bcrypt.compare(data.data.password, user.password);
  
    if (!isValidUser) {
      return res.status(403).json({
        message: "Invalid Credentials"
      })
    }
  
    if (!process.env.JWT_SECRET) {
      return res.status(403).send("Jwt is missiing")
    }
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    
    res.status(200).json({
      message : "Sign up Done",
      token
    })
  }catch(e){
    return res.status(403).send("Error")
  }
})


// app.get("/website",authMiddleWare, async (req,res)=>{
//   const website =  await prisma.website.findMany({
//     where:{
//       userId : req.userId
//     },
//     include:{
//       tickes:{
//         orderBy:[{
//           createdAt:'desc'
//         }],
//         take : 1
//       }
//     }
//   })

//   res.json({
//     website
//   })
// })

app.get("/website", authMiddleWare, async (req, res) => {
  try {
    const websites = await prisma.website.findMany({
      where: {
        userId: req.userId
      },
      include: {
        tickes: {
          orderBy: [{
            createdAt: 'desc'
          }],
          take: 1
        }
      }
    })

    // Debug logging
    console.log("User ID:", req.userId)
    console.log("Found websites:", websites.length)
    websites.forEach(w => {
      console.log(`Website ${w.url}: ${w.tickes.length} ticks`)
      if (w.tickes.length > 0) {
        console.log(`  Latest status: ${w.tickes[0]?.status}`)
      }
    })

    res.json({
      website: websites
    })
  } catch (e) {
    console.error("Error fetching websites:", e)
    res.status(500).json({ message: "Error fetching websites" })
  }
})
app.listen(3001,()=>{
    console.log("Server is running on port 3001");
    
})