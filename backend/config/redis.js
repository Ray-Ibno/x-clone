import { Redis } from '@upstash/redis'
const redis = new Redis({
  url: 'https://magical-arachnid-73383.upstash.io',
  token: 'gQAAAAAAAR6nAAIgcDJiODcyZDM3ZDI4NzQ0NDEyYWJmNzc1N2RkODdhNDgxZQ',
})

const res = await redis.ping()

async function testConnection() {
  try {
    const res = await redis.ping()
    if (res === 'PONG') {
      console.log('✅ Upstash Redis connection successful!')
    }
  } catch (error) {
    console.error('❌ Upstash Redis connection failed:', error)
  }
}

testConnection()

export default redis
