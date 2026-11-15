
import './Navbar.css'

function Navbar({ activePage, setActivePage, handleLogout, user }) {
  const rolePages = {
    student: ['Dashboard', 'Problems', 'Workspace', 'Progress'],
    teacher: ['Dashboard', 'Manage Problems'],
    admin: ['Dashboard', 'Manage Users', 'Manage Problems'],
  }

  const pages = rolePages[user?.role] || ['Dashboard']

  return (
    <nav className="navbar">
      <h2 className="navbar-logo">AlgoPilot<span>.</span></h2>

      <div className="navbar-links">
        {pages.map((page) => (
          <button
            key={page}
            className={`nav-link ${activePage === page ? 'active' : ''}`}
            onClick={() => setActivePage(page)}
          >
            {page}
          </button>
        ))}
      </div>

      <button className="logout-button" onClick={handleLogout}>
        Logout
      </button>
    </nav>
  )
}

export default Navbar
