import Redis from "ioredis";

export const redisClient = new Redis({
  host: process.env.REDIS_HOST || "localhost",
  port: 6379,
});

let redisAvailable = true;

redisClient.on("error", (err) => {
  console.error("Redis connection error:", err);
  redisAvailable = false;
});

redisClient.on("connect", () => {
  console.log("Redis connected");
  redisAvailable = true;
});

export const isRedisAvailable = () => redisAvailable;
