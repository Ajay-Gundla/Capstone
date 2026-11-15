
import { useState } from 'react'
import Navbar from './components/Navbar'
import StudentWorkspace from './pages/StudentWorkspace'
import Login from './pages/Login'
import Register from './pages/register'
import ProblemList from './components/ProblemList'
import TeacherDashboard from './pages/TeacherDashboard'
import AdminDashboard from './pages/AdminDashboard'
import UserManagement from './pages/UserManagement'
import TeacherProblems from './pages/TeacherProblems'
import SubmissionHistory from './pages/SubmissionHistory'
import StudentProgress from './pages/StudentProgress'

function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user')
    return savedUser ? JSON.parse(savedUser) : null
  })

  const [showRegister, setShowRegister] = useState(false)
  const [activePage, setActivePage] = useState('Dashboard')
  const [selectedProblem, setSelectedProblem] = useState('two-sum')

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    setShowRegister(false)
    setActivePage('Dashboard')
  }

  if (!user) {
    return (
      <div>
        {showRegister ? (
          <>
            <Register
              onLogin={setUser}
              onShowLogin={() => setShowRegister(false)}
            />
            <p>Already have an account?</p>
            <button onClick={() => setShowRegister(false)}>
              Login
            </button>
          </>
        ) : (
          <Login
            onLogin={setUser}
            onShowRegister={() => setShowRegister(true)}
          />
        )}
      </div>
    )
  }

  return (
    <>
      <Navbar
        activePage={activePage}
        setActivePage={setActivePage}
        handleLogout={handleLogout}
        user={user}
      />

      {activePage === 'Dashboard' && (
        user.role === 'admin' ? (
          <AdminDashboard
            user={user}
            setActivePage={setActivePage}
          />
        ) : user.role === 'teacher' ? (
          <TeacherDashboard user={user} />
        ) : (
          <StudentProgress
            onViewAllSubmissions={() => setActivePage('Submissions')}
          />
        )
      )}

      {activePage === 'Manage Users' && user.role === 'admin' && (
        <UserManagement />
      )}

      {activePage === 'Manage Problems' &&
        (user.role === 'teacher' || user.role === 'admin') && (
          <TeacherProblems />
        )}

      {activePage === 'Problems' && (
        <ProblemList
          onSelectProblem={(slug) => {
            setSelectedProblem(slug)
            setActivePage('Workspace')
          }}
        />
      )}

      {activePage === 'Workspace' && (
        <StudentWorkspace problemSlug={selectedProblem} />
      )}

      {activePage === 'Progress' && (
        <h2 style={{ textAlign: 'center' }}>
          Progress page coming soon
        </h2>
      )}
      {activePage === 'Progress' && user.role === 'student' && (
        <StudentProgress
          onViewAllSubmissions={() => setActivePage('Submissions')}
        />
      )}

      {activePage === 'Submissions' && user.role === 'student' && (
        <SubmissionHistory />
      )}
    </>
  )
}

export default App
