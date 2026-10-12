import 'dotenv/config'
import * as bcrypt from 'bcrypt'
import mongoose from 'mongoose'
import * as dns from 'node:dns'
dns.setServers(['8.8.8.8', '1.1.1.1'])
async function seedAdmin() {
  const mongoUri = process.env.MONGODB_URI
  const name = process.env.ADMIN_NAME
  const email = process.env.ADMIN_EMAIL
  const password = process.env.ADMIN_PASSWORD

  if (!mongoUri || !name || !email || !password) {
    throw new Error(
      'Missing MongoDB or admin environment variables',
    )
  }

  await mongoose.connect(mongoUri)

  const adminsCollection =
    mongoose.connection.collection('admins')

  const normalizedEmail = email
    .trim()
    .toLowerCase()

  const existingAdmin =
    await adminsCollection.findOne({
      email: normalizedEmail,
    })

  if (existingAdmin) {
    console.log('Admin already exists.')
    await mongoose.disconnect()
    return
  }

  const passwordHash = await bcrypt.hash(
    password,
    12,
  )

  await adminsCollection.insertOne({
    name: name.trim(),
    email: normalizedEmail,
    passwordHash,
    isActive: true,
    lastLoginAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  })

  console.log('Admin created successfully.')

  await mongoose.disconnect()
}

seedAdmin().catch(async (error) => {
  console.error('Failed to seed admin:', error)

  await mongoose.disconnect()

  process.exit(1)
})