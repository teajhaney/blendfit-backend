import type { TokenPayload } from "./index.ts";
import type { Redis } from "ioredis";

declare module 'express' {
  interface Request {
    user?: TokenPayload;
    redisClient?: Redis;
  }
}
