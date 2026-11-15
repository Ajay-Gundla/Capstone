
import { useState } from 'react'
import axios from 'axios'
import './Login.css'

function Login({ onLogin, onShowRegister }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()

    try {
      const response = await axios.post(
        'http://localhost:5001/api/auth/login',
        { email, password }
      )

      localStorage.setItem('token', response.data.token)
      localStorage.setItem('user', JSON.stringify(response.data.user))

      onLogin(response.data.user)
      setMessage('Login successful!')
    } catch (error) {
      setMessage(error.response?.data?.message || 'Login failed')
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <h2>AlgoPilot<span>.</span></h2>
        <p>Sign in to continue your coding journey.</p>

        <form className="login-form" onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button className="login-button" type="submit">
            Sign In
          </button>
        </form>

        {message && <p className="login-message">{message}</p>}

        <div className="register-link">
          Don't have an account?{' '}
          <button type="button" onClick={onShowRegister}>
            Register
          </button>
        </div>
      </div>
    </div>
  )
}

export default Login
