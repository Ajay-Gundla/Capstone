import { useState } from 'react'
import Navbar from './components/Navbar'
import StudentWorkspace from './pages/StudentWorkspace'
import Login from './pages/Login'
import Register from './pages/register'
import ProblemList from './components/ProblemList'
import LearningPath from './components/LearningPath'
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
  const [selectedProblem, setSelectedProblem] = useState(null)

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')

    setUser(null)
    setShowRegister(false)
    setActivePage('Dashboard')
    setSelectedProblem(null)
  }

  if (!user) {
    return showRegister ? (
      <Register
        onLogin={setUser}
        onShowLogin={() => setShowRegister(false)}
      />
    ) : (
      <Login
        onLogin={setUser}
        onShowRegister={() => setShowRegister(true)}
      />
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

      {activePage === 'Problems' && user.role === 'student' && (
        <ProblemList
          onSelectProblem={(slug) => {
            setSelectedProblem(slug)
            setActivePage('Workspace')
          }}
        />
      )}

      {activePage === 'Learning Path' && user.role === 'student' && (
        <LearningPath />
      )}

      {activePage === 'Workspace' && user.role === 'student' && (
        selectedProblem ? (
          <StudentWorkspace problemSlug={selectedProblem} />
        ) : (
          <div style={{ textAlign: 'center', padding: '80px 20px' }}>
            <h2>No Problem Selected</h2>
            <p>Select a coding problem before opening the workspace.</p>
            <button
              onClick={() => setActivePage('Problems')}
              style={{
                padding: '12px 20px',
                background: '#171717',
                color: 'white',
                border: 'none',
                borderRadius: '7px',
                cursor: 'pointer',
                marginTop: '15px'
              }}
            >
              Browse Problems
            </button>
          </div>
        )
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
