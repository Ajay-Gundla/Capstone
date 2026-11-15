
import { useState } from 'react'
import axios from 'axios'
import './Register.css'

function Register({ onLogin, onShowLogin }) {
  const [form, setForm] = useState({
    username: '',
    name: '',
    email: '',
    password: ''
  })

  const [message, setMessage] = useState('')

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  const handleRegister = async (e) => {
    e.preventDefault()

    try {
      const response = await axios.post(
        'http://localhost:5001/api/auth/register',
        form
      )

      localStorage.setItem('token', response.data.token)
      localStorage.setItem('user', JSON.stringify(response.data.user))

      onLogin(response.data.user)
      setMessage('Registration successful!')
    } catch (error) {
      setMessage(error.response?.data?.message || 'Registration failed')
    }
  }

  return (
    <div className="register-page">
      <div className="register-card">
        <h2>AlgoPilot<span>.</span></h2>
        <p>Create your account and start coding.</p>

        <form className="register-form" onSubmit={handleRegister}>
          <input
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            required
          />

          <input
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            required
          />

          <input
            name="email"
            type="email"
            placeholder="Email address"
            value={form.email}
            onChange={handleChange}
            required
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />

          <button className="register-button" type="submit">
            Create Account
          </button>
        </form>

        {message && (
          <p className="register-message">{message}</p>
        )}

        <div className="register-login-link">
          Already have an account?{' '}
          <button type="button" onClick={onShowLogin}>
            Login
          </button>
        </div>
      </div>
    </div>
  )
}

export default Register
