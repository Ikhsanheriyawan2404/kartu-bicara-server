import { Request, Response, NextFunction } from "express";
import { isRedisAvailable, redisClient } from "../config/redis";

const WINDOW_SECONDS = 1;
const MAX_REQUESTS = 2;

export async function rateLimiter(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  if (!isRedisAvailable()) {
    return next();
  }

  try {
    const ip = req.ip || req.connection.remoteAddress || "unknown";
    const key = `rate_limit:${ip}`;

    const current = await redisClient.incr(key);

    if (current === 1) {
      await redisClient.expire(key, WINDOW_SECONDS);
    }

    if (current > MAX_REQUESTS) {
      res.status(429).json({
        error: "Too many request.",
      });
      return;
    }

    next();
  } catch (error) {
    console.error("Rate limiter error:", error);
    res.status(500).json({ error: "Internal server error (rate limiter)." });
  }
}
