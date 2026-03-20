import mongoose from 'mongoose'

export const setUpGracefulShutdown = (server) => {
  const handler = (signal) => {
    console.log(`\nReceived ${signal}, starting graceful shutdown...`)

    server.close(async (err) => {
      if (err) {
        console.error('Error closing the server', err)
        process.exit(1)
      }

      console.log('Http server closed.')

      try {
        await mongoose.connection.close()
        console.log('Database connection closed.')

        process.exit(0)
      } catch (dbErr) {
        console.error('Error closing the database', dbErr)
        process.exit(1)
      }
    })

    setTimeout(() => {
      console.log('Shutdown timed out, forcing exit.')
      process.exit(1)
    }, 10000)
  }

  process.on('SIGTERM', () => handler('SIGTERM'))
  process.on('SIGINT', () => handler('SIGINT'))
}
