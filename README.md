# BetterUptime TypeScript

A distributed website monitoring system built with TypeScript, featuring real-time uptime tracking, multi-region support, and an elegant dashboard interface.

## 🌟 Features

- **Real-time Website Monitoring**: Track multiple websites simultaneously with response time measurements
- **Multi-Region Support**: Deploy workers in different geographical regions for accurate global monitoring
- **Distributed Architecture**: Uses Redis Streams for reliable, acknowledged message queuing
- **Modern Tech Stack**: Built with Next.js, Prisma, PostgreSQL, and Redis
- **Beautiful Dashboard**: Clean, responsive UI with dark mode support
- **Status Tracking**: Visual indicators for Up/Down status with response times
- **Automatic Health Checks**: Configurable monitoring intervals (default: 3 seconds)

## 🏗️ Architecture

```
┌─────────────┐
│   Next.js   │  Frontend (Port 3000)
│  Dashboard  │  - User authentication
└──────┬──────┘  - Website management UI
       │         - Real-time status display
       │
       ▼
┌─────────────┐
│  Express    │  Backend API (Port 3001)
│     API     │  - User signup/signin
└──────┬──────┘  - Website CRUD operations
       │         - JWT authentication
       │
       ▼
┌─────────────┐
│  PostgreSQL │  Database
│   + Prisma  │  - Users, Websites, Ticks
└──────┬──────┘  - Relational data storage
       │
       │
       ▼
┌─────────────┐      ┌──────────────┐
│   Pusher    │─────▶│ Redis Stream │
│   Service   │      │ (Website Q)  │
└─────────────┘      └──────┬───────┘
                            │
                            ▼
                     ┌──────────────┐
                     │   Workers    │
                     │ (Multi-region)│
                     └──────┬───────┘
                            │
                            ▼
                     ┌──────────────┐
                     │ Redis Stream │
                     │   (DB Q)     │
                     └──────┬───────┘
                            │
                            ▼
                     ┌──────────────┐
                     │  DB Worker   │
                     │ (Persistence)│
                     └──────────────┘
```



## 🚀 Getting Started

### Prerequisites

- Node.js 18+ or Bun
- PostgreSQL database
- Redis server
- npm/yarn/bun

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Rudraprajapati2612/betteruptime-typescript.git
   cd betteruptime-typescript
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   bun install
   ```

3. **Set up environment variables**

   Create `.env` files in each app directory:

   **apps/api/.env**
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/betteruptime"
   JWT_SECRET="your-secret-key-here"
   ```

   **apps/pusher/.env**
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/betteruptime"
   REDIS_URL="redis://localhost:6379"
   ```

   **apps/workers/.env**
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/betteruptime"
   REDIS_URL="redis://localhost:6379"
   REGION_ID="95340fdb-783a-4b3e-94b7-50668758a33b"  # Unique region ID
   WORKER_ID="worker-1"
   DB_CONSUMER_ID="db-worker-1"
   ```

   **apps/web/.env.local**
   ```env
   NEXT_PUBLIC_BACKEND_URL="http://localhost:3001"
   ```

4. **Set up the database**
   ```bash
   cd packages/db
   npx prisma generate
   npx prisma db push
   ```

5. **Initialize Redis Consumer Groups**
   ```bash
   redis-cli

   # Create consumer groups
   XGROUP CREATE betteruptime:website <YOUR_REGION_ID> $ MKSTREAM
   XGROUP CREATE betteruptime:db db-workers $ MKSTREAM
   ```

### Running the Application

You need to run 4 services simultaneously:

**Terminal 1 - Backend API**
```bash
cd apps/api
bun run index.ts
# Runs on http://localhost:3001
```

**Terminal 2 - Pusher Service**
```bash
cd apps/pusher
bun run index.ts
# Pushes websites to Redis every 3 seconds
```

**Terminal 3 - Worker Service**
```bash
cd apps/workers
bun run index.ts
# Monitors websites and stores results
```

**Terminal 4 - Frontend**
```bash
cd apps/web
npm run dev
# Runs on http://localhost:3000
```

## 📊 Database Schema

### User
- `id` (UUID, Primary Key)
- `username` (String, Unique)
- `password` (String, Hashed)

### Website
- `id` (UUID, Primary Key)
- `url` (String)
- `timeAdded` (DateTime)
- `userId` (UUID, Foreign Key → User)

### WebsiteTick
- `id` (UUID, Primary Key)
- `response_time` (Int) - Response time in milliseconds
- `status` (Enum: Up/Down/Unknown)
- `website_id` (UUID, Foreign Key → Website)
- `region_id` (UUID, Foreign Key → Region)
- `createdAt` (DateTime)

### Region
- `id` (UUID, Primary Key)
- `name` (String) - Region name (e.g., "US-East", "EU-West")

## 🔧 How It Works

### 1. User Flow
1. User signs up/signs in via the dashboard
2. User adds websites to monitor
3. Dashboard displays real-time status of all websites

### 2. Monitoring Flow
1. **Pusher Service** queries all websites from PostgreSQL every 3 seconds
2. Pushes website data (`url`, `websiteId`) to Redis Stream `betteruptime:website`
3. **Worker Service** consumes messages from Redis Stream
4. Worker makes HTTP requests to websites and measures response time
5. Worker publishes results (status, response time, region) to Redis Stream `betteruptime:db`
6. **DB Worker** consumes from DB stream and persists ticks to PostgreSQL
7. **API** serves latest ticks to frontend via `/website` endpoint
8. **Frontend** displays status with real-time updates

### 3. Redis Streams Architecture

**Website Stream** (`betteruptime:website`)
- Consumer Groups: One per region (e.g., `95340fdb-783a-4b3e-94b7-50668758a33b`)
- Message Format: `{url: string, websiteId: string}`
- Purpose: Distribute monitoring tasks to regional workers

**DB Stream** (`betteruptime:db`)
- Consumer Group: `db-workers`
- Message Format: `{status, websiteId, responseTime, regionId, timestamp}`
- Purpose: Reliable persistence of monitoring results

## 🎯 API Endpoints

### Authentication
- `POST /user/signup` - Create new user account
- `POST /user/signin` - Sign in and receive JWT token

### Websites
- `GET /website` - Get all websites for authenticated user (includes latest tick)
- `POST /website` - Add new website to monitor
- `GET /status/:websiteId` - Get detailed status for specific website

## 🎨 Frontend Features

- **Authentication**: JWT-based secure authentication
- **Dashboard**: Clean interface showing all monitored websites
- **Status Indicators**: 
  - 🟢 Green = Up
  - 🔴 Red = Down
  - ⚫ Gray = Unknown/No data
- **Response Time Display**: Shows milliseconds for Up status
- **Last Check**: Human-readable time since last check (e.g., "5m ago")
- **Theme Toggle**: Light/Dark mode support
- **Add Website Modal**: Easy-to-use form for adding new websites
- **Polling**: Auto-refreshes data after adding websites (with visual "Checking..." state)

## 🌍 Multi-Region Setup

To deploy workers in multiple regions:

1. **Create unique region in database**
   ```sql
   INSERT INTO "Region" (id, name) VALUES 
   ('95340fdb-783a-4b3e-94b7-50668758a33b', 'US-East'),
   ('03071aa0-703e-4607-a35f-ad1ac3c86e5f', 'EU-West');
   ```

2. **Create Redis consumer group for each region**
   ```bash
   XGROUP CREATE betteruptime:website 95340fdb-783a-4b3e-94b7-50668758a33b $ MKSTREAM
   XGROUP CREATE betteruptime:website 03071aa0-703e-4607-a35f-ad1ac3c86e5f $ MKSTREAM
   ```

3. **Deploy worker instance per region**
   - Set `REGION_ID` environment variable to the respective region UUID
   - Workers automatically consume from their regional consumer group

## 🔍 Monitoring & Debugging

### Check Redis Stream Contents
```bash
# View all messages in website stream
XRANGE betteruptime:website - + COUNT 100

# View consumer group info
XINFO GROUPS betteruptime:website

# Check pending messages
XPENDING betteruptime:website <REGION_ID> - + 10

# Acknowledge stuck messages
XACK betteruptime:website <REGION_ID> <message-id>
```

### Check Database
```sql
-- View all websites
SELECT * FROM "Website";

-- View latest ticks
SELECT w.url, wt.status, wt.response_time, wt."createdAt"
FROM "Website" w
LEFT JOIN "WebsiteTick" wt ON w.id = wt.website_id
ORDER BY wt."createdAt" DESC
LIMIT 20;

-- Check user's websites with tick counts
SELECT w.url, COUNT(wt.id) as tick_count
FROM "Website" w
LEFT JOIN "WebsiteTick" wt ON w.id = wt.website_id
WHERE w."userId" = '<user-id>'
GROUP BY w.id, w.url;
```

## 🐛 Troubleshooting

### Website shows "Unknown" status
- **Cause**: No ticks in database for this website
- **Solutions**:
  1. Check if pusher is running and pushing websites
  2. Check if worker is consuming from Redis
  3. Verify consumer group is not stuck: `XPENDING betteruptime:website <REGION_ID>`
  4. Acknowledge pending messages if stuck

### Worker not processing new websites
- **Cause**: Consumer group has pending unacknowledged messages
- **Solution**: 
  ```bash
  # Clear pending messages
  XACK betteruptime:website <REGION_ID> <message-id>
  
  # Or reset consumer group
  XGROUP DESTROY betteruptime:website <REGION_ID>
  XGROUP CREATE betteruptime:website <REGION_ID> $ MKSTREAM
  ```

### Authentication errors
- Verify JWT_SECRET is set correctly in backend
- Check token is stored in localStorage after signin
- Ensure Authorization header is sent with requests

## 🚦 Performance Considerations

- **Monitoring Interval**: Default 3 seconds (configurable in pusher)
- **Response Timeout**: 5 seconds per website check
- **Redis Stream Retention**: Consider using MAXLEN to limit stream size
- **Database Indexes**: Ensure indexes on `website_id`, `userId`, and `createdAt`
- **Worker Scaling**: Add more workers per region for higher throughput

## 🔐 Security

- Passwords hashed using bcrypt (10 rounds)
- JWT tokens for authentication (1 hour expiration)
- CORS enabled for frontend communication
- Environment variables for sensitive data
- No API keys exposed in frontend

## 📝 Future Enhancements

- [ ] Email/SMS notifications for downtime
- [ ] Historical uptime charts and analytics
- [ ] Custom monitoring intervals per website
- [ ] Webhook integrations
- [ ] Status page generation
- [ ] SSL certificate monitoring
- [ ] Custom headers and authentication for monitored sites
- [ ] Incident timeline and reporting
- [ ] Team collaboration features


## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the MIT License.

## 👨‍💻 Author

**Rudra Prajapati**
- GitHub: [@Rudraprajapati2612](https://github.com/Rudraprajapati2612)
- Repository: [betteruptime-typescript](https://github.com/Rudraprajapati2612/betteruptime-typescript)

## 🙏 Acknowledgments

- Inspired by [Better Uptime](https://betteruptime.com/)
- Built with modern TypeScript ecosystem
- Redis Streams for reliable message queuing
- Prisma for type-safe database operations

---

**Made with ❤️ and TypeScript**
