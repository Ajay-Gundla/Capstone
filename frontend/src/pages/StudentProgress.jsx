
import './StudentProgress.css'

function StudentProgress() {
  const stats = [
    { label: 'Problems Solved', value: 24 },
    { label: 'Total Submissions', value: 58 },
    { label: 'Acceptance Rate', value: '68%' },
    { label: 'Current Streak', value: '5 days' }
  ]

  const difficulty = [
    { name: 'Easy', solved: 15, total: 30 },
    { name: 'Medium', solved: 7, total: 25 },
    { name: 'Hard', solved: 2, total: 15 }
  ]

  const activity = [
    0, 2, 1, 4, 3, 0, 5,
    2, 1, 3, 0, 4, 2, 5,
    1, 0, 3, 2, 4, 1, 5,
    0, 2, 3, 1, 4, 0, 2,
    5, 3, 1, 0, 4, 2, 3,
    1, 5, 2, 0, 4, 1, 3,
    2, 0, 5, 1, 4, 2, 3,
    0, 1, 5, 2, 4, 0, 3,
    1, 2, 5, 0, 4, 3, 1,
    2, 0, 4, 5, 1, 3, 2,
    0, 4, 1, 3, 2, 5, 0,
    1, 4, 2, 3, 1, 0, 4
  ]

  const totalContributions = activity.reduce(
    (total, count) => total + count,
    0
  )

  const recentActivity = [
    {
      id: 1,
      problem: 'Two Sum',
      language: 'Python',
      date: '15 Nov 2026, 10:30 AM',
      verdict: 'Accepted'
    },
    {
      id: 2,
      problem: 'Reverse Linked List',
      language: 'JavaScript',
      date: '14 Nov 2026, 04:15 PM',
      verdict: 'Wrong Answer'
    },
    {
      id: 3,
      problem: 'Binary Tree Paths',
      language: 'C++',
      date: '13 Nov 2026, 11:20 AM',
      verdict: 'Runtime Error'
    },
    {
      id: 4,
      problem: 'Valid Parentheses',
      language: 'Python',
      date: '12 Nov 2026, 02:45 PM',
      verdict: 'Accepted'
    }
  ]

  return (
    <div className="student-progress">

      {/* Header */}
      <header className="progress-header">
        <p className="progress-label">STUDENT PORTAL</p>
        <h1>My Progress</h1>
        <p>Track your coding journey and improvement.</p>
      </header>

      {/* Statistics */}
      <section className="progress-stats">
        {stats.map((stat) => (
          <div className="progress-stat-card" key={stat.label}>
            <span>{stat.label}</span>
            <h2>{stat.value}</h2>
          </div>
        ))}
      </section>

      {/* Difficulty Progress */}
      <section className="difficulty-section">
        <h2>Problems by Difficulty</h2>

        {difficulty.map((item) => (
          <div className="difficulty-item" key={item.name}>
            <div className="difficulty-info">
              <strong>{item.name}</strong>
              <span>
                {item.solved} / {item.total} solved
              </span>
            </div>

            <div className="progress-track">
              <div
                className="progress-fill"
                style={{
                  width: `${(item.solved / item.total) * 100}%`
                }}
              />
            </div>
          </div>
        ))}
      </section>

      {/* GitHub Style Activity Heatmap */}
      <section className="activity-section">

        <div className="activity-heading">
          <div>
            <h2>Weekly Coding Activity</h2>
            <p>Your coding contributions over the last 12 weeks.</p>
          </div>

          <span className="activity-total">
            {totalContributions} contributions
          </span>
        </div>

        <div className="heatmap-wrapper">

          <div className="heatmap-days">
            <span>Mon</span>
            <span>Wed</span>
            <span>Fri</span>
            <span>Sun</span>
          </div>

          <div className="heatmap-grid">
            {activity.map((count, index) => (
              <div
                key={index}
                className={`heatmap-cell level-${count}`}
                title={`${count} problems solved`}
              />
            ))}
          </div>

        </div>

        <div className="heatmap-legend">
          <span>Less</span>

          {[0, 1, 2, 3, 4, 5].map((level) => (
            <div
              key={level}
              className={`heatmap-cell level-${level}`}
            />
          ))}

          <span>More</span>
        </div>

      </section>

      {/* Recent Activity */}
      <section className="recent-activity-section">

        <div className="recent-activity-header">
          <div>
            <h2>Recent Activity</h2>
            <p>Your latest coding submissions.</p>
          </div>

          <span>{recentActivity.length} submissions</span>
        </div>

        <div className="recent-activity-list">

          {recentActivity.map((item) => (
            <div className="recent-activity-item" key={item.id}>

              <div className="activity-indicator">
                <span
                  className={`activity-dot ${item.verdict
                    .toLowerCase()
                    .replace(' ', '-')}`}
                />
              </div>

              <div className="recent-activity-details">
                <h3>{item.problem}</h3>

                <p>
                  {item.language} · {item.date}
                </p>
              </div>

              <span
                className={`activity-verdict ${item.verdict
                  .toLowerCase()
                  .replace(' ', '-')}`}
              >
                {item.verdict}
              </span>

            </div>
          ))}

        </div>

      </section>

    </div>
  )
}

export default StudentProgress
