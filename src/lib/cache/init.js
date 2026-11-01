import { RedisCacheProvider } from "../../pkg/cache/redis.js";
import { env } from "../config/env.js";

export const cacheProvider = new RedisCacheProvider({
  port: env.redis.port,
  host: env.redis.host,
  password: env.redis.password || "",
});
