
const bcrypt = require('bcryptjs')
const pool = require('./db')

async function createAdmin() {
  try {
    const username = 'admin01'
    const name = 'Test Admin'
    const email = 'admin01@example.com'
    const password = 'Admin@123'

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
    console.log('Email:', email)
    console.log('Password:', password)

  } catch (error) {
    console.error('Error creating admin:', error)
  } finally {
    await pool.end()
  }
}

createAdmin()
