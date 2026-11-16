
require('dotenv').config()

const bcrypt = require('bcryptjs')
const pool = require('./db')

async function createTeacher() {
  try {
    const username = process.env.TEACHER_USERNAME
    const name = process.env.TEACHER_NAME
    const email = process.env.TEACHER_EMAIL
    const password = process.env.TEACHER_PASSWORD

    if (!username || !name || !email || !password) {
      throw new Error('Missing teacher environment variables')
    }

    const existing = await pool.query(
      'SELECT id FROM users WHERE email = $1 OR username = $2',
      [email, username]
    )

    if (existing.rows.length > 0) {
      console.log('Teacher account already exists.')
      return
    }

    const passwordHash = await bcrypt.hash(password, 12)

    await pool.query(
      `INSERT INTO users
       (username, name, email, password_hash, role)
       VALUES ($1, $2, $3, $4, 'teacher')`,
      [username, name, email, passwordHash]
    )

    console.log('Teacher account created successfully!')
  } catch (error) {
    console.error('Error creating teacher:', error)
    process.exitCode = 1
  } finally {
    await pool.end()
  }
}

createTeacher()
