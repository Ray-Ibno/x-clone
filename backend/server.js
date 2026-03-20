import 'dotenv/config'

import dbConnect from './config/dbConnect.js'
import { server as socketServer } from './listeners/socket.js'
import { setUpGracefulShutdown } from './utils/shutdown.js'

const PORT = process.env.PORT || 5200

const serverStart = async () => {
  await dbConnect()

  const server = socketServer.listen(PORT, () => {
    console.log(`listening to port ${PORT}`)
  })

  setUpGracefulShutdown(server)
}

serverStart()
