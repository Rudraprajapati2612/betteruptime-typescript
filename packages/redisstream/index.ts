import { createClient } from "redis";



export const client = await createClient()
  .on("error", (err) => console.error("Redis Error", err))
  .connect();



export type WebsiteEvent = {
  url: string;
  id: string;
};

export type WebsiteMessage = {
  id: string;
  message: {
    url: string;
    id: string;
  };
};

export type DbMessage = {
  id: string;
  message: {
    status: "Up" | "Down";
    websiteId: string;
    regionId: string;
    responseTime: string;
    timestamp: string;
  };
};


export const WEBSITE_STREAM = "betteruptime:website";
export const DB_STREAM = "betteruptime:db";


async function xAddWebsite(event: WebsiteEvent) {
  await client.xAdd(WEBSITE_STREAM, "*", {
    url: event.url,
    id: event.id,
  });
}

export async function xAddBulk(websites: WebsiteEvent[]) {
  for (const w of websites) {
    await xAddWebsite(w);
  }
}

export async function xReadGroup(
  consumerGroup: string,
  consumerId: string
): Promise<WebsiteMessage[] | undefined> {
  const res = await client.xReadGroup(
    consumerGroup,
    consumerId,
    { key: WEBSITE_STREAM, id: ">" },
    { COUNT: 5, BLOCK: 5000 }
  );

  // redis returns [{ name, messages }]
  // @ts-ignore
  return res?.[0]?.messages;
}



export async function xAddWebsiteStatus(
  status: "Up" | "Down",
  websiteId: string,
  responseTime: number,
  regionId: string
) {
  await client.xAdd(DB_STREAM, "*", {
    status,
    websiteId,
    regionId,
    responseTime: responseTime.toString(),
    timestamp: Date.now().toString(),
  });
}

export async function xReadGroupDb(
  stream: string,
  consumerGroup: string,
  consumerId: string
): Promise<DbMessage[] | undefined> {
  const res = await client.xReadGroup(
    consumerGroup,
    consumerId,
    { key: stream, id: ">" },
    { COUNT: 10, BLOCK: 5000 }
  );

  // @ts-ignore
  return res?.[0]?.messages;
}

/* -------------------- ACK Helpers -------------------- */

async function xAck(
  stream: string,
  consumerGroup: string,
  messageId: string
) {
  await client.xAck(stream, consumerGroup, messageId);
}

export async function xAckBulk(
  stream: string,
  consumerGroup: string,
  messageIds: string[]
) {
  await Promise.all(
    messageIds.map((id) => xAck(stream, consumerGroup, id))
  );
}
