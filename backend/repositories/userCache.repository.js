import redis from '../config/redis.js'

const ONE_HOUR = 3600

export const userCache = {
  getUser(key) {
    return redis.get(key)
  },
  setUser(key, user) {
    return redis.set(key, JSON.stringify(user), { ex: ONE_HOUR })
  },
}
