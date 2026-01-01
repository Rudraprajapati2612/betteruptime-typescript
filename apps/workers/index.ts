import axios from "axios";
import "dotenv/config"
import { xAckBulk, xReadGroup } from "redisstream";
import { prisma } from "db/client";
import { resolve } from "bun";
const REGION_ID = process.env.REGION_ID!;
const WORKER_ID = process.env.WORKER_ID!;

if(!REGION_ID){
    throw new Error("Region id is missing")
}

if(!WORKER_ID){
    throw new Error("Worker id is missing")
}

async function main(){
    while(1){
    // read from the Strema 
    let response  = await xReadGroup(REGION_ID,WORKER_ID);
    if(!response){
        continue;
    }
    let promises = response.map(({message})=>{fetchWebsite(message.url,message.id)})
    console.log(promises.length);
    
    await Promise.all(promises);
    // process the website and store the result in the DB 

    // Todo it should be probably routed through a queue in a bulk DB request 

    // Send Ack to the queue that this event has been proceed 
    xAckBulk(REGION_ID,response.map(({id})=>id))
    }
}


async function fetchWebsite(url:string,websiteId:string){
    return new Promise<void>((resolve,reject)=>{
            

        // process for checking Status 
        const startTime = Date.now()
        axios.get(url)
        .then(async ()=>{
            const endTime = Date.now();
            await prisma.websiteTick.create({
                data:{
                    respone_time : endTime - startTime,
                    status : "Up",
                    region_id : REGION_ID,
                    website_id : websiteId
                }
            })
            resolve()
        })
        .catch(async ()=>{
            const endTime = Date.now();
            await prisma.websiteTick.create({
                data:{
                    respone_time : endTime - startTime,
                    status : "Down",
                    region_id : REGION_ID,
                    website_id : websiteId
                }
            })
            resolve()
        })
    })
}
main()