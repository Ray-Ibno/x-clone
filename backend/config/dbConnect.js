import mongoose from 'mongoose'

const dbConnect = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI)
    console.log(`connected to the db: ${conn.connection.host}`)
  } catch (error) {
    console.error(`Database connection error: ${error.message}`)
    process.exit(1)
  }
}

export default dbConnect
