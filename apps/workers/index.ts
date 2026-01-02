import {
    xAckBulk,
    xAddWebsiteStatus,
    xReadGroup,
    xReadGroupDb,
    WEBSITE_STREAM,
    DB_STREAM,
  } from "redisstream";
  import axios from "axios";
  import { prisma } from "db/client";
  
  
  
  const REGION_ID = process.env.REGION_ID!;
  const WORKER_ID = process.env.WORKER_ID!;
  const DB_CONSUMER_ID = process.env.DB_CONSUMER_ID!;
  
  const DB_CONSUMER_GROUP = "db-workers";
  
 
  
  async function fetchWebsite(url: string, websiteId: string) {
    const start = Date.now();
  
    try {
      await axios.get(url, { timeout: 5000 });
      await xAddWebsiteStatus(
        "Up",
        websiteId,
        Date.now() - start,
        REGION_ID
      );
    } catch {
      await xAddWebsiteStatus(
        "Down",
        websiteId,
        Date.now() - start,
        REGION_ID
      );
    }
  }
  
 
  
  async function dbWorker() {
    while (true) {
      const messages = await xReadGroupDb(
        DB_STREAM,
        DB_CONSUMER_GROUP,
        DB_CONSUMER_ID
      );
  
      if (!messages || messages.length === 0) continue;
  
      console.log(`DB worker received ${messages.length} events`);
  
      const records = messages.map((m) => ({
        website_id: m.message.websiteId,
        status: m.message.status,
        response_time: Number(m.message.responseTime),
        region_id: m.message.regionId,
      }));
  
      await prisma.websiteTick.createMany({
        data: records.map((r) => ({
          website_id: r.website_id,
          status: r.status as any,
          response_time: r.response_time,
          region_id: r.region_id,
        })),
      });
  
      await xAckBulk(
        DB_STREAM,
        DB_CONSUMER_GROUP,
        messages.map((m) => m.id)
      );
    }
  }
  
  
  async function mainWorker() {
    while (true) {
      try {
        const messages = await xReadGroup(REGION_ID, WORKER_ID);
  
        if (!messages || messages.length === 0) continue;
  
        console.log(`Processing ${messages.length} websites`);
  
        await Promise.all(
          messages.map(({ message }) =>
            fetchWebsite(message.url, message.id)
          )
        );
  
        await xAckBulk(
          WEBSITE_STREAM,
          REGION_ID,
          messages.map((m) => m.id)
        );
  
        console.log(`Acknowledged ${messages.length} website jobs`);
      } catch (e) {
        console.error("Main worker error:", e);
        await new Promise((r) => setTimeout(r, 1000));
      }
    }
  }
  
  
  Promise.all([
    mainWorker().catch((e) => {
      console.error("Fatal main worker error:", e);
      process.exit(1);
    }),
    dbWorker().catch((e) => {
      console.error("Fatal DB worker error:", e);
      process.exit(1);
    }),
  ]);
  