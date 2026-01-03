import "dotenv/config"
import { prisma } from "db/client";
import { xAddBulk } from "redisstream";

async function main(){
    const websites = await prisma.website.findMany({
        select:{
            url: true,
            id: true
        }
    })
    
    console.log(`[PUSHER] Found ${websites.length} websites in database:`)
    websites.forEach(w => {
        console.log(`  - ${w.url} (ID: ${w.id})`)
    })
    
    console.log(`[PUSHER] Pushing to Redis...`)
    
    await xAddBulk(
        websites.map(w => ({
            url: w.url,
            websiteId: w.id
        }))
    )
    
    console.log(`[PUSHER] Successfully pushed ${websites.length} websites to Redis`)
}

setInterval(() => {
    main()
}, 3 * 1000);

console.log("[PUSHER] Starting pusher service...")
main()