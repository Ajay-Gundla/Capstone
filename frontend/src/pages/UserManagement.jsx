
import { useMemo, useState } from 'react'
import './UserManagement.css'

const initialUsers = [
  {
    id: 1,
    name: 'Student One',
    email: 'student1@example.com',
    role: 'student',
    status: 'Active',
    joined: '2026-11-10'
  },
  {
    id: 2,
    name: 'Teacher One',
    email: 'teacher1@example.com',
    role: 'teacher',
    status: 'Active',
    joined: '2026-11-08'
  },
  {
    id: 3,
    name: 'Student Two',
    email: 'student2@example.com',
    role: 'student',
    status: 'Inactive',
    joined: '2026-11-05'
  },
  {
    id: 4,
    name: 'Admin One',
    email: 'admin01@example.com',
    role: 'admin',
    status: 'Active',
    joined: '2026-11-01'
  },
  {
    id: 5,
    name: 'Student Three',
    email: 'student3@example.com',
    role: 'student',
    status: 'Active',
    joined: '2026-10-28'
  },
  {
    id: 6,
    name: 'Teacher Two',
    email: 'teacher2@example.com',
    role: 'teacher',
    status: 'Inactive',
    joined: '2026-10-25'
  },
  {
    id: 7,
    name: 'Student Four',
    email: 'student4@example.com',
    role: 'student',
    status: 'Active',
    joined: '2026-10-20'
  },
  {
    id: 8,
    name: 'Student Five',
    email: 'student5@example.com',
    role: 'student',
    status: 'Active',
    joined: '2026-10-15'
  },
  {
    id: 9,
    name: 'Teacher Three',
    email: 'teacher3@example.com',
    role: 'teacher',
    status: 'Active',
    joined: '2026-10-10'
  },
  {
    id: 10,
    name: 'Student Six',
    email: 'student6@example.com',
    role: 'student',
    status: 'Inactive',
    joined: '2026-10-05'
  }
]

function UserManagement() {
  const [users, setUsers] = useState(initialUsers)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')
  const [sortBy, setSortBy] = useState('newest')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(5)
  const [selectedUser, setSelectedUser] = useState(null)

  // Filter and sort users
  const filteredUsers = useMemo(() => {
    let result = users.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase())

      const matchesRole =
        roleFilter === 'All' || user.role === roleFilter

      const matchesStatus =
        statusFilter === 'All' || user.status === statusFilter

      return matchesSearch && matchesRole && matchesStatus
    })

    result = [...result].sort((a, b) => {
      if (sortBy === 'name-asc') {
        return a.name.localeCompare(b.name)
      }

      if (sortBy === 'name-desc') {
        return b.name.localeCompare(a.name)
      }

      if (sortBy === 'oldest') {
        return new Date(a.joined) - new Date(b.joined)
      }

      return new Date(b.joined) - new Date(a.joined)
    })

    return result
  }, [users, search, roleFilter, statusFilter, sortBy])

  // Pagination
  const totalPages = Math.max(
    1,
    Math.ceil(filteredUsers.length / pageSize)
  )

  const safePage = Math.min(currentPage, totalPages)

  const startIndex = (safePage - 1) * pageSize

  const displayedUsers = filteredUsers.slice(
    startIndex,
    startIndex + pageSize
  )

  // Statistics
  const totalUsers = users.length
  const students = users.filter((u) => u.role === 'student').length
  const teachers = users.filter((u) => u.role === 'teacher').length
  const admins = users.filter((u) => u.role === 'admin').length
  const activeUsers = users.filter((u) => u.status === 'Active').length
  const inactiveUsers = totalUsers - activeUsers

  // Reset page when filters change
  const resetPage = () => setCurrentPage(1)

  // Activate / Deactivate
  const toggleStatus = (id) => {
    const updatedUsers = users.map((user) =>
      user.id === id
        ? {
            ...user,
            status: user.status === 'Active' ? 'Inactive' : 'Active'
          }
        : user
    )

    setUsers(updatedUsers)

    if (selectedUser?.id === id) {
      const updatedSelectedUser = updatedUsers.find(
        (user) => user.id === id
      )
      setSelectedUser(updatedSelectedUser)
    }
  }

  const clearFilters = () => {
    setSearch('')
    setRoleFilter('All')
    setStatusFilter('All')
    setSortBy('newest')
    setCurrentPage(1)
  }

  return (
    <div className="user-management">

      {/* Header */}
      <div className="um-heading">
        <div>
          <p className="um-label">ADMINISTRATION</p>
          <h1>User Management</h1>
          <p>View, search and manage all platform accounts.</p>
        </div>
      </div>

      {/* Statistics */}
      <section className="um-stats">
        <div className="um-stat-card">
          <span>Total Users</span>
          <h2>{totalUsers}</h2>
        </div>

        <div className="um-stat-card">
          <span>Students</span>
          <h2>{students}</h2>
        </div>

        <div className="um-stat-card">
          <span>Teachers</span>
          <h2>{teachers}</h2>
        </div>

        <div className="um-stat-card">
          <span>Admins</span>
          <h2>{admins}</h2>
        </div>

        <div className="um-stat-card">
          <span>Active Users</span>
          <h2>{activeUsers}</h2>
        </div>

        <div className="um-stat-card">
          <span>Inactive Users</span>
          <h2>{inactiveUsers}</h2>
        </div>
      </section>

      {/* User Directory */}
      <section className="um-directory">

        <div className="um-directory-heading">
          <div>
            <h2>All Users</h2>
            <p>Search and manage registered accounts.</p>
          </div>

          <span className="um-result-count">
            {filteredUsers.length} users found
          </span>
        </div>

        {/* Filters */}
        <div className="um-filters">

          <div className="um-search">
            <label htmlFor="um-search">Search</label>
            <input
              id="um-search"
              type="text"
              placeholder="Search name or email..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                resetPage()
              }}
            />
          </div>

          <div className="um-filter">
            <label htmlFor="um-role">Role</label>
            <select
              id="um-role"
              value={roleFilter}
              onChange={(e) => {
                setRoleFilter(e.target.value)
                resetPage()
              }}
            >
              <option value="All">All Roles</option>
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="um-filter">
            <label htmlFor="um-status">Status</label>
            <select
              id="um-status"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value)
                resetPage()
              }}
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <div className="um-filter">
            <label htmlFor="um-sort">Sort By</label>
            <select
              id="um-sort"
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value)
                resetPage()
              }}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="name-asc">Name A-Z</option>
              <option value="name-desc">Name Z-A</option>
            </select>
          </div>

          <button className="um-clear-button" onClick={clearFilters}>
            Clear Filters
          </button>

        </div>

        {/* Table */}
        <div className="um-table-wrapper">
          <table className="um-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {displayedUsers.length > 0 ? (
                displayedUsers.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <div className="um-user-name">
                        <div className="um-avatar">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <strong>{user.name}</strong>
                      </div>
                    </td>

                    <td>{user.email}</td>

                    <td>
                      <span className={`um-role ${user.role}`}>
                        {user.role}
                      </span>
                    </td>

                    <td>
                      <span className={`um-status ${user.status.toLowerCase()}`}>
                        {user.status}
                      </span>
                    </td>

                    <td>
                      {new Date(user.joined + 'T00:00:00').toLocaleDateString(
                        'en-IN',
                        {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        }
                      )}
                    </td>

                    <td>
                      <div className="um-actions">
                        <button
                          className="um-view-button"
                          onClick={() => setSelectedUser(user)}
                        >
                          View
                        </button>

                        <button
                          className={
                            user.status === 'Active'
                              ? 'um-deactivate-button'
                              : 'um-activate-button'
                          }
                          onClick={() => toggleStatus(user.id)}
                        >
                          {user.status === 'Active' ? 'Deactivate' : 'Activate'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="um-empty">
                    No users found. Try changing your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="um-pagination">

          <div className="um-page-size">
            <label htmlFor="um-page-size">Rows per page</label>
            <select
              id="um-page-size"
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value))
                setCurrentPage(1)
              }}
            >
              <option value="5">5</option>
              <option value="10">10</option>
            </select>
          </div>

          <span className="um-page-info">
            {filteredUsers.length === 0
              ? '0 users'
              : `${startIndex + 1}-${Math.min(
                  startIndex + pageSize,
                  filteredUsers.length
                )} of ${filteredUsers.length}`}
          </span>

          <div className="um-page-buttons">
            <button
              disabled={safePage === 1}
              onClick={() => setCurrentPage(1)}
            >
              First
            </button>

            <button
              disabled={safePage === 1}
              onClick={() => setCurrentPage((page) => page - 1)}
            >
              Previous
            </button>

            <span>{safePage} / {totalPages}</span>

            <button
              disabled={safePage === totalPages}
              onClick={() => setCurrentPage((page) => page + 1)}
            >
              Next
            </button>

            <button
              disabled={safePage === totalPages}
              onClick={() => setCurrentPage(totalPages)}
            >
              Last
            </button>
          </div>

        </div>

      </section>

      {/* User Details Modal */}
      {selectedUser && (
        <div
          className="um-modal-overlay"
          onClick={() => setSelectedUser(null)}
        >
          <div
            className="um-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="um-modal-heading">
              <div>
                <p className="um-label">USER DETAILS</p>
                <h2>{selectedUser.name}</h2>
              </div>

              <button
                className="um-close-button"
                onClick={() => setSelectedUser(null)}
              >
                ×
              </button>
            </div>

            <div className="um-modal-avatar">
              {selectedUser.name.charAt(0).toUpperCase()}
            </div>

            <div className="um-detail-row">
              <span>Full Name</span>
              <strong>{selectedUser.name}</strong>
            </div>

            <div className="um-detail-row">
              <span>Email Address</span>
              <strong>{selectedUser.email}</strong>
            </div>

            <div className="um-detail-row">
              <span>Role</span>
              <strong>{selectedUser.role}</strong>
            </div>

            <div className="um-detail-row">
              <span>Account Status</span>
              <strong>{selectedUser.status}</strong>
            </div>

            <div className="um-detail-row">
              <span>Joined Date</span>
              <strong>{selectedUser.joined}</strong>
            </div>

            <button
              className={
                selectedUser.status === 'Active'
                  ? 'um-modal-deactivate'
                  : 'um-modal-activate'
              }
              onClick={() => toggleStatus(selectedUser.id)}
            >
              {selectedUser.status === 'Active'
                ? 'Deactivate Account'
                : 'Activate Account'}
            </button>

          </div>
        </div>
      )}

    </div>
  )
}

export default UserManagement
