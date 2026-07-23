import redis from '../config/redis.js'

const ONE_HOUR = 3600

export const notificationCache = {
  getNotification(key) {
    return redis.get(key)
  },
  setNotification(key, payload) {
    return redis.set(key, payload, { ex: ONE_HOUR })
  },
}
