import type { TokenPayload } from "./index.ts";

declare module 'express' {
  interface Request {
    user?: TokenPayload;
  }
}
