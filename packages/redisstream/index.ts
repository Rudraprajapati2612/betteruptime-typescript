import { createClient } from "redis";

const client =  await createClient().
on("error",(err)=>console.log("Reddis Error",err))
.connect()


type websiteEvent = {url:String,id:String}
type MessageType = {
    id :string,
    message:{
        url : string,
        id  : string
    }
}
const STREAM_NAME = 'betteruptime:website'
async function xAdd({url,id}:websiteEvent){
    await client.xAdd(
        STREAM_NAME ,'*',{
            url:String(url),
            id:String(id)
        }
    )
}

export async function xAddBulk(website:websiteEvent[]){
    for(let i=0;i<website.length;i++){
        
        await xAdd({
        url : website[i]!.url,
        id : website[i]!.id
    
    })

    }
}


export async function  xReadGroup(consumerGroup:String,workerId : String):Promise<MessageType[]|undefined>{
    const res =   await client.xReadGroup(
        String(consumerGroup),String(workerId) ,{
            key : STREAM_NAME,
            id :'>'
        },{
            'COUNT':5
        }
    )
            // @ts-ignore
    let messages : MessageType[] | undefined = res?.[0]?.messages
    
    return messages;
}

async function xAck(consumerGroup :String,streamId : String){
    await client.xAck(STREAM_NAME,String(consumerGroup),String(streamId))
}

export async function xAckBulk(consumerGroup:string,eventids:string[]){
    eventids.map(eventId=>xAck(consumerGroup,eventId))
}