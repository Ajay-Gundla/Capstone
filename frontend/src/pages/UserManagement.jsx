
import { useState } from 'react'
import './UserManagement.css'

function UserManagement() {
  const [search, setSearch] = useState('')
  const [role, setRole] = useState('All')

  // Temporary sample data - we'll connect the API later
  const users = [
    { id: 1, name: 'Student One', email: 'student1@example.com', role: 'student', status: 'Active' },
    { id: 2, name: 'Teacher One', email: 'teacher1@example.com', role: 'teacher', status: 'Active' },
    { id: 3, name: 'Student Two', email: 'student2@example.com', role: 'student', status: 'Inactive' },
  ]

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase())

    const matchesRole = role === 'All' || user.role === role

    return matchesSearch && matchesRole
  })

  return (
    <div className="user-management">
      <h1>User Management</h1>
      <p>View and manage AlgoPilot accounts.</p>

      <div className="user-filters">
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="All">All Roles</option>
          <option value="student">Students</option>
          <option value="teacher">Teachers</option>
          <option value="admin">Admins</option>
        </select>
      </div>

      <div className="users-table-wrapper">
        <table className="users-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>{user.status}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredUsers.length === 0 && <p>No users found.</p>}
      </div>
    </div>
  )
}

export default UserManagement
