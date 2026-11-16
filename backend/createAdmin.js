
require('dotenv').config()

const bcrypt = require('bcryptjs')
const pool = require('./db')

async function createAdmin() {
  try {
    const username = process.env.ADMIN_USERNAME
    const name = process.env.ADMIN_NAME
    const email = process.env.ADMIN_EMAIL
    const password = process.env.ADMIN_PASSWORD

    if (!username || !name || !email || !password) {
      throw new Error('Missing admin environment variables')
    }

    const existing = await pool.query(
      'SELECT id FROM users WHERE email = $1 OR username = $2',
      [email, username]
    )

    if (existing.rows.length > 0) {
      console.log('Admin account already exists.')
      return
    }

    const passwordHash = await bcrypt.hash(password, 12)

    await pool.query(
      `INSERT INTO users
       (username, name, email, password_hash, role)
       VALUES ($1, $2, $3, $4, 'admin')`,
      [username, name, email, passwordHash]
    )

    console.log('Admin account created successfully!')
  } catch (error) {
    console.error('Error creating admin:', error)
    process.exitCode = 1
  } finally {
    await pool.end()
  }
}

createAdmin()
