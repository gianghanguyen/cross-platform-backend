# Cross-platfrom backend
## Run app
1. Install dependencies
Before running the application, install all necessary dependencies:
```
npm install 
```
2. Setup database and redis 
Run the following command to start MySQL and Redis using Docker:
```
docker-compose up -d
```
If you're not using Docker, install MySQL and Redis manually on your system. Alternatively, you can create cloud databases using the following services:
[Aiven MySQL](https://console.aiven.io/)

[Redis](https://cloud.redis.io/])

3. Run app
```
npm run dev
```

## Prisma setup
After every change that's made to Prisma schema, to regenerate the Prisma client, run
```
npx prisma generate
```

To apply change to database, run
```
npx prisma migrate dev
```
