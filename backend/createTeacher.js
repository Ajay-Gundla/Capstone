
const bcrypt = require('bcryptjs')
const pool = require('./db')

async function createTeacher() {
  try {
    const username = 'teacher01'
    const name = 'Test Teacher'
    const email = 'teacher01@example.com'
    const password = 'Teacher@123'

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
    console.log('Email:', email)
    console.log('Password:', password)
  } catch (error) {
    console.error('Error creating teacher:', error)
  } finally {
    await pool.end()
  }
}

createTeacher()
