
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

  return (
    <div className="student-progress">
      <header className="progress-header">
        <p className="progress-label">STUDENT PORTAL</p>
        <h1>My Progress</h1>
        <p>Track your coding journey and improvement.</p>
      </header>

      <section className="progress-stats">
        {stats.map((stat) => (
          <div className="progress-stat-card" key={stat.label}>
            <span>{stat.label}</span>
            <h2>{stat.value}</h2>
          </div>
        ))}
      </section>

      <section className="difficulty-section">
        <h2>Problems by Difficulty</h2>

        {difficulty.map((item) => (
          <div className="difficulty-item" key={item.name}>
            <div className="difficulty-info">
              <strong>{item.name}</strong>
              <span>{item.solved} / {item.total} solved</span>
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
    </div>
  )
}

export default StudentProgress
