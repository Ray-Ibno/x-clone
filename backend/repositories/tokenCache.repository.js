import redis from '../config/redis.js'

export const tokenCache = {
  async setSession(key, payload, ttl) {
    return await redis.set(key, payload, { ex: Number(ttl) })
  },
  async getSession(key) {
    return await redis.get(key)
  },
  async deleteSession(...keys) {
    return await redis.del(...keys)
  },
}
