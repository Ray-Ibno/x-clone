import redis from '../config/redis.js'

const ONE_HOUR = 3600

export const userCache = {
  getKey(key) {
    return redis.get(key)
  },
  setKey(key, payload) {
    return redis.set(key, payload, { ex: ONE_HOUR })
  },
  deleteKey(...key) {
    return redis.del(...key)
  },
}
