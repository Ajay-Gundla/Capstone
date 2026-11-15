
import { useState } from 'react'
import './AdminDashboard.css'

function AdminDashboard({ user, setActivePage }) {
  const [registrationRange, setRegistrationRange] = useState('7')

  // Main statistics
  const stats = [
    { label: 'Total Users', value: 3 },
    { label: 'Students', value: 1 },
    { label: 'Teachers', value: 1 },
    { label: 'Active Users', value: 3 },
    { label: 'Total Problems', value: 12 },
    { label: 'Published Problems', value: 8 }
  ]

  // Performance statistics
  const performanceStats = [
    { label: 'Total Submissions', value: '42', note: 'All submissions' },
    { label: 'Acceptance Rate', value: '57.1%', note: '24 accepted' },
    { label: 'Accepted Submissions', value: '24', note: 'Successful runs' },
    { label: 'Failed Submissions', value: '18', note: 'Wrong answer or runtime error' }
  ]

  // Recent users
  const recentUsers = [
    {
      id: 1,
      name: 'Test Student',
      email: 'teststudent_new@example.com',
      role: 'Student',
      status: 'Active',
      date: '16 Nov 2026'
    },
    {
      id: 2,
      name: 'Test Teacher',
      email: 'teacher01@example.com',
      role: 'Teacher',
      status: 'Active',
      date: '15 Nov 2026'
    },
    {
      id: 3,
      name: 'Admin',
      email: 'admin01@example.com',
      role: 'Admin',
      status: 'Active',
      date: '14 Nov 2026'
    }
  ]

  // Recent submissions
  const recentActivity = [
    {
      id: 1,
      title: 'Two Sum',
      user: 'Test Student',
      language: 'Python',
      status: 'Accepted',
      executionTime: '120 ms',
      date: '15 Nov 2026'
    },
    {
      id: 2,
      title: 'Reverse Linked List',
      user: 'Test Student',
      language: 'JavaScript',
      status: 'Wrong Answer',
      executionTime: '250 ms',
      date: '14 Nov 2026'
    },
    {
      id: 3,
      title: 'Binary Tree Paths',
      user: 'Test Student',
      language: 'C++',
      status: 'Runtime Error',
      executionTime: '85 ms',
      date: '13 Nov 2026'
    }
  ]

  // Platform overview data
  const difficultyData = [
    { label: 'Easy', count: 5 },
    { label: 'Medium', count: 4 },
    { label: 'Hard', count: 3 }
  ]

  const verdictData = [
    { label: 'Accepted', count: 24 },
    { label: 'Wrong Answer', count: 12 },
    { label: 'Runtime Error', count: 6 }
  ]

  // Weekly submission trend
  const weeklyData = [
    { day: 'Mon', count: 3 },
    { day: 'Tue', count: 5 },
    { day: 'Wed', count: 4 },
    { day: 'Thu', count: 8 },
    { day: 'Fri', count: 6 },
    { day: 'Sat', count: 9 },
    { day: 'Sun', count: 7 }
  ]

  // User analytics
  const userDistribution = [
    { label: 'Students', count: 1 },
    { label: 'Teachers', count: 1 },
    { label: 'Admins', count: 1 }
  ]

  const accountStatus = [
    { label: 'Active Accounts', count: 3 },
    { label: 'Inactive Accounts', count: 0 }
  ]

  // Registration data for different date ranges
  const registrationDataByRange = {
    '7': [
      { day: 'Mon', count: 0 },
      { day: 'Tue', count: 1 },
      { day: 'Wed', count: 0 },
      { day: 'Thu', count: 2 },
      { day: 'Fri', count: 1 },
      { day: 'Sat', count: 3 },
      { day: 'Sun', count: 2 }
    ],

    '30': [
      { day: 'Week 1', count: 5 },
      { day: 'Week 2', count: 7 },
      { day: 'Week 3', count: 4 },
      { day: 'Week 4', count: 8 }
    ],

    '90': [
      { day: 'Month 1', count: 18 },
      { day: 'Month 2', count: 22 },
      { day: 'Month 3', count: 25 }
    ]
  }

  const registrationData = registrationDataByRange[registrationRange]

  const maxRegistrations = Math.max(
    ...registrationData.map((item) => item.count),
    1
  )

  // Chart limits
  const maxDifficulty = 5
  const maxVerdict = 24
  const maxUsers = 3

  // Problem analytics
  const problemAnalytics = [
    {
      id: 1,
      title: 'Two Sum',
      difficulty: 'Easy',
      attempts: 18,
      failed: 5
    },
    {
      id: 2,
      title: 'Reverse Linked List',
      difficulty: 'Medium',
      attempts: 12,
      failed: 8
    },
    {
      id: 3,
      title: 'Binary Tree Paths',
      difficulty: 'Hard',
      attempts: 8,
      failed: 6
    },
    {
      id: 4,
      title: 'Valid Parentheses',
      difficulty: 'Easy',
      attempts: 4,
      failed: 1
    }
  ]

  const totalProblemAttempts = problemAnalytics.reduce(
    (total, problem) => total + problem.attempts,
    0
  )

  const totalFailedAttempts = problemAnalytics.reduce(
    (total, problem) => total + problem.failed,
    0
  )

  const averageAttempts = (
    totalProblemAttempts / problemAnalytics.length
  ).toFixed(1)

  const highestAttemptProblem = [...problemAnalytics].sort(
    (a, b) => b.attempts - a.attempts
  )[0]

  const highestFailureProblem = [...problemAnalytics].sort(
    (a, b) =>
      (b.failed / b.attempts) - (a.failed / a.attempts)
  )[0]

  return (
    <div className="admin-dashboard">

      {/* Header */}
      <header className="admin-heading">
        <div>
          <p className="admin-label">ADMINISTRATION PORTAL</p>
          <h1>Welcome, {user?.name || 'Admin'}</h1>
          <p>Manage users, teachers and coding problems.</p>
        </div>
      </header>

      {/* Main Statistics */}
      <section className="admin-stats">
        {stats.map((stat) => (
          <div className="admin-stat-card" key={stat.label}>
            <span>{stat.label}</span>
            <h2>{stat.value}</h2>
          </div>
        ))}
      </section>

      {/* Platform Management */}
      <section className="admin-management">
        <h2>Platform Management</h2>

        <div className="admin-management-grid">
          <div className="admin-management-card">
            <h3>User Management</h3>
            <p>View and manage student and teacher accounts.</p>

            <button onClick={() => setActivePage('Manage Users')}>
              Manage Users
            </button>
          </div>

          <div className="admin-management-card">
            <h3>Problem Management</h3>
            <p>View and manage coding problems on AlgoPilot.</p>

            <button onClick={() => setActivePage('Manage Problems')}>
              Manage Problems
            </button>
          </div>
        </div>
      </section>

      {/* Performance Analytics */}
      <section className="admin-performance">
        <div className="admin-section-title">
          <h2>Performance Analytics</h2>
          <p>Monitor coding submissions and platform performance.</p>
        </div>

        <div className="admin-performance-stats">
          {performanceStats.map((stat) => (
            <div className="admin-performance-card" key={stat.label}>
              <span>{stat.label}</span>
              <h3>{stat.value}</h3>
              <p>{stat.note}</p>
            </div>
          ))}
        </div>

        {/* Weekly Submission Trend */}
        <div className="admin-chart-card admin-weekly-chart">
          <div className="admin-chart-heading">
            <div>
              <h3>Weekly Submission Trend</h3>
              <p>Number of submissions over the last seven days.</p>
            </div>

            <span className="admin-chart-tag">Last 7 days</span>
          </div>

          <div className="admin-line-chart">
            <svg
              viewBox="0 0 560 220"
              role="img"
              aria-label="Weekly submission trend"
              preserveAspectRatio="none"
            >
              <line x1="35" y1="30" x2="535" y2="30" className="chart-grid-line" />
              <line x1="35" y1="75" x2="535" y2="75" className="chart-grid-line" />
              <line x1="35" y1="120" x2="535" y2="120" className="chart-grid-line" />
              <line x1="35" y1="165" x2="535" y2="165" className="chart-grid-line" />

              <polyline
                points="40,150 120,110 200,130 280,50 360,90 440,30 520,70"
                className="chart-line"
              />

              {[
                [40, 150],
                [120, 110],
                [200, 130],
                [280, 50],
                [360, 90],
                [440, 30],
                [520, 70]
              ].map(([x, y], index) => (
                <circle
                  key={index}
                  cx={x}
                  cy={y}
                  r="5"
                  className="chart-point"
                />
              ))}
            </svg>

            <div className="admin-chart-days">
              {weeklyData.map((item) => (
                <div key={item.day}>
                  <strong>{item.count}</strong>
                  <span>{item.day}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Platform Overview */}
      <section className="admin-overview">
        <h2>Platform Overview</h2>
        <p className="admin-overview-subtitle">
          Overview of problems and coding submissions.
        </p>

        <div className="admin-charts-grid">

          {/* Problems by Difficulty */}
          <div className="admin-chart-card">
            <h3>Problems by Difficulty</h3>
            <p>Distribution of coding problems.</p>

            <div className="admin-chart-total">
              <strong>12</strong>
              <span>Total Problems</span>
            </div>

            <div className="admin-bars">
              {difficultyData.map((item) => (
                <div className="admin-bar-item" key={item.label}>
                  <div className="admin-bar-heading">
                    <span>{item.label}</span>
                    <strong>{item.count}</strong>
                  </div>

                  <div className="admin-bar-track">
                    <div
                      className="admin-bar-fill"
                      style={{
                        width: `${(item.count / maxDifficulty) * 100}%`
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Submission Verdicts */}
          <div className="admin-chart-card">
            <h3>Submission Verdicts</h3>
            <p>Distribution of submission results.</p>

            <div className="admin-chart-total">
              <strong>42</strong>
              <span>Total Submissions</span>
            </div>

            <div className="admin-bars">
              {verdictData.map((item) => (
                <div className="admin-bar-item" key={item.label}>
                  <div className="admin-bar-heading">
                    <span>{item.label}</span>
                    <strong>{item.count}</strong>
                  </div>

                  <div className="admin-bar-track">
                    <div
                      className="admin-bar-fill"
                      style={{
                        width: `${(item.count / maxVerdict) * 100}%`
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* User Analytics */}
      <section className="admin-user-analytics">
        <div className="admin-section-title">
          <h2>User Analytics</h2>
          <p>Understand user distribution, account activity and registrations.</p>
        </div>

        {/* User Growth */}
        <div className="admin-user-growth">
          <div className="admin-growth-card">
            <span>Total Registered Users</span>
            <h3>3</h3>
            <p>Across all platform roles</p>
          </div>

          <div className="admin-growth-card">
            <span>Active Accounts</span>
            <h3>3</h3>
            <p>100% of registered users</p>
          </div>

          <div className="admin-growth-card">
            <span>Inactive Accounts</span>
            <h3>0</h3>
            <p>Accounts currently inactive</p>
          </div>

          <div className="admin-growth-card">
            <span>New Registrations</span>
            <h3>9</h3>
            <p>Illustrative seven-day total</p>
          </div>
        </div>

        <div className="admin-charts-grid">

          {/* User Distribution */}
          <div className="admin-chart-card">
            <h3>User Distribution</h3>
            <p>Registered users by role.</p>

            <div className="admin-chart-total">
              <strong>3</strong>
              <span>Total Users</span>
            </div>

            <div className="admin-bars">
              {userDistribution.map((item) => (
                <div className="admin-bar-item" key={item.label}>
                  <div className="admin-bar-heading">
                    <span>{item.label}</span>
                    <strong>{item.count}</strong>
                  </div>

                  <div className="admin-bar-track">
                    <div
                      className="admin-bar-fill"
                      style={{
                        width: `${(item.count / maxUsers) * 100}%`
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Account Status */}
          <div className="admin-chart-card">
            <h3>Account Status</h3>
            <p>Active and inactive accounts.</p>

            <div className="admin-chart-total">
              <strong>100%</strong>
              <span>Accounts Active</span>
            </div>

            <div className="admin-bars">
              {accountStatus.map((item) => (
                <div className="admin-bar-item" key={item.label}>
                  <div className="admin-bar-heading">
                    <span>{item.label}</span>
                    <strong>{item.count}</strong>
                  </div>

                  <div className="admin-bar-track">
                    <div
                      className="admin-bar-fill"
                      style={{
                        width: `${(item.count / maxUsers) * 100}%`
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* New User Registrations */}
        <div className="admin-chart-card admin-registration-chart">
          <div className="admin-chart-heading">
            <div>
              <h3>New User Registrations</h3>
              <p>Registration activity for the selected period.</p>
            </div>

            <select
              className="admin-range-select"
              value={registrationRange}
              onChange={(e) => setRegistrationRange(e.target.value)}
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
            </select>
          </div>

          <div className="admin-registration-bars">
            {registrationData.map((item) => (
              <div className="admin-registration-item" key={item.day}>
                <strong>{item.count}</strong>

                <div className="admin-registration-track">
                  <div
                    className="admin-registration-fill"
                    style={{
                      height: `${Math.max(
                        (item.count / maxRegistrations) * 100,
                        item.count === 0 ? 0 : 8
                      )}%`
                    }}
                  />
                </div>

                <span>{item.day}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Problem Analytics */}
      <section className="admin-problem-analytics">

        <div className="admin-section-title">
          <h2>Problem Analytics</h2>
          <p>Understand problem popularity and student performance.</p>
        </div>

        {/* Problem KPI Cards */}
        <div className="admin-problem-stats">

          <div className="admin-problem-stat">
            <span>Total Attempts</span>
            <h3>{totalProblemAttempts}</h3>
            <p>Across tracked problems</p>
          </div>

          <div className="admin-problem-stat">
            <span>Average Attempts</span>
            <h3>{averageAttempts}</h3>
            <p>Per tracked problem</p>
          </div>

          <div className="admin-problem-stat">
            <span>Failed Attempts</span>
            <h3>{totalFailedAttempts}</h3>
            <p>Unsuccessful submissions</p>
          </div>

          <div className="admin-problem-stat">
            <span>Most Attempted</span>
            <h3>{highestAttemptProblem.title}</h3>
            <p>{highestAttemptProblem.attempts} attempts</p>
          </div>

        </div>

        {/* Problem Insights */}
        <div className="admin-charts-grid">

          <div className="admin-chart-card">
            <h3>Most Attempted Problems</h3>
            <p>Problems ranked by submission attempts.</p>

            <div className="admin-bars">
              {problemAnalytics.map((problem) => (
                <div className="admin-bar-item" key={problem.id}>
                  <div className="admin-bar-heading">
                    <span>{problem.title}</span>
                    <strong>{problem.attempts}</strong>
                  </div>

                  <div className="admin-bar-track">
                    <div
                      className="admin-bar-fill"
                      style={{
                        width: `${(problem.attempts / highestAttemptProblem.attempts) * 100}%`
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="admin-chart-card">
            <h3>Highest Failure Rates</h3>
            <p>Percentage of unsuccessful attempts.</p>

            <div className="admin-bars">
              {[...problemAnalytics]
                .sort(
                  (a, b) =>
                    (b.failed / b.attempts) - (a.failed / a.attempts)
                )
                .map((problem) => {
                  const failureRate = (
                    (problem.failed / problem.attempts) * 100
                  ).toFixed(1)

                  return (
                    <div className="admin-bar-item" key={problem.id}>
                      <div className="admin-bar-heading">
                        <span>{problem.title}</span>
                        <strong>{failureRate}%</strong>
                      </div>

                      <div className="admin-bar-track">
                        <div
                          className="admin-bar-fill"
                          style={{ width: `${failureRate}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
            </div>

            <p className="admin-problem-insight">
              Highest failure rate: {highestFailureProblem.title}
            </p>
          </div>

        </div>

        {/* Problem Ranking Table */}
        <div className="admin-table-section admin-problem-ranking">

          <div className="admin-section-heading">
            <div>
              <h2>Problem Performance Ranking</h2>
              <p>Compare attempts, difficulty and failure rates.</p>
            </div>
          </div>

          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Problem</th>
                  <th>Difficulty</th>
                  <th>Attempts</th>
                  <th>Failed</th>
                  <th>Failure Rate</th>
                </tr>
              </thead>

              <tbody>
                {[...problemAnalytics]
                  .sort((a, b) => b.attempts - a.attempts)
                  .map((problem, index) => (
                    <tr key={problem.id}>
                      <td>#{index + 1}</td>
                      <td>{problem.title}</td>
                      <td>{problem.difficulty}</td>
                      <td>{problem.attempts}</td>
                      <td>{problem.failed}</td>
                      <td>
                        {((problem.failed / problem.attempts) * 100).toFixed(1)}%
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

        </div>

      </section>

      {/* Recent Registrations */}
      <section className="admin-table-section">
        <div className="admin-section-heading">
          <div>
            <h2>Recent Registrations</h2>
            <p>Recently registered platform users.</p>
          </div>

          <button onClick={() => setActivePage('Manage Users')}>
            View All
          </button>
        </div>

        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Registered</th>
              </tr>
            </thead>

            <tbody>
              {recentUsers.map((item) => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>{item.email}</td>
                  <td>
                    <span className={`admin-role ${item.role.toLowerCase()}`}>
                      {item.role}
                    </span>
                  </td>
                  <td>
                    <span className={`admin-user-status ${item.status.toLowerCase()}`}>
                      {item.status}
                    </span>
                  </td>
                  <td>{item.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Recent Platform Activity */}
      <section className="admin-table-section">
        <div className="admin-section-heading">
          <div>
            <h2>Recent Platform Activity</h2>
            <p>Latest coding submissions by students.</p>
          </div>
        </div>

        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Problem</th>
                <th>Student</th>
                <th>Language</th>
                <th>Verdict</th>
                <th>Execution Time</th>
                <th>Date</th>
              </tr>
            </thead>

            <tbody>
              {recentActivity.map((item) => (
                <tr key={item.id}>
                  <td>{item.title}</td>
                  <td>{item.user}</td>
                  <td>{item.language}</td>
                  <td>
                    <span
                      className={`admin-verdict ${item.status
                        .toLowerCase()
                        .replaceAll(' ', '-')}`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td>{item.executionTime}</td>
                  <td>{item.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

    </div>
  )
}

export default AdminDashboard
