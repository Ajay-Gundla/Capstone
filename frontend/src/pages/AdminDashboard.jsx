
import './AdminDashboard.css'

function AdminDashboard({ user }) {
  return (
    <div className="admin-dashboard">
      <header className="admin-heading">
        <div>
          <p className="admin-label">ADMINISTRATION PORTAL</p>
          <h1>Welcome, {user?.name || 'Admin'}</h1>
          <p>Manage users, teachers and coding problems.</p>
        </div>
      </header>

      <div className="admin-stats">
        <div className="admin-stat-card">
          <span>Total Users</span>
          <h2>0</h2>
        </div>

        <div className="admin-stat-card">
          <span>Students</span>
          <h2>0</h2>
        </div>

        <div className="admin-stat-card">
          <span>Teachers</span>
          <h2>0</h2>
        </div>

        <div className="admin-stat-card">
          <span>Total Problems</span>
          <h2>0</h2>
        </div>
      </div>

      <section className="admin-management">
        <h2>Platform Management</h2>
        <div className="admin-management-grid">
          <div className="admin-management-card">
            <h3>User Management</h3>
            <p>View and manage student and teacher accounts.</p>
            <button>Manage Users</button>
          </div>

          <div className="admin-management-card">
            <h3>Problem Management</h3>
            <p>View and manage coding problems on AlgoPilot.</p>
            <button>Manage Problems</button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default AdminDashboard
