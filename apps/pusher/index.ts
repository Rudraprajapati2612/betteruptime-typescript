import "dotenv/config"
import { prisma } from "db/client";
import { xAddBulk } from "redisstream";
async function main(){
    const website = await prisma.website.findMany({
        select:{
            url:true,
            id:true
        }
    })
    console.log(website.length)
    await xAddBulk(
        website.map(w=>({
            url : w.url,
            id : w.id
        }))
    )
}
setInterval(() => {
    main()
}, 3*1000);
main()