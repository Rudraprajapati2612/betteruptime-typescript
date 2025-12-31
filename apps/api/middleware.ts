import "dotenv/config"
import type { Request,Response,NextFunction } from "express";
import jwt   from "jsonwebtoken";

export function authMiddleWare(req:Request,res:Response,next:NextFunction){
  const header = req.headers.authorization!;
  if(!process.env.JWT_SECRET){
    return res.send("jwt missing")
  }
  try {
    let data = jwt.verify(header, process.env.JWT_SECRET)  as jwt.JwtPayload;;
    req.userId = (data as any).userId
    next()
    
    
  }catch(e){
    res.status(403).send(" ")
  }  
}