
import { useState } from 'react'
import './SubmissionHistory.css'

function SubmissionHistory() {
  const [filter, setFilter] = useState('All')

  const [submissions] = useState([
    {
      id: 1,
      problem: 'Two Sum',
      language: 'Python',
      date: '15 Nov 2026, 10:30 AM',
      verdict: 'Accepted',
      attempts: 1
    },
    {
      id: 2,
      problem: 'Reverse Linked List',
      language: 'JavaScript',
      date: '14 Nov 2026, 04:15 PM',
      verdict: 'Wrong Answer',
      attempts: 3
    },
    {
      id: 3,
      problem: 'Binary Tree Paths',
      language: 'C++',
      date: '13 Nov 2026, 11:20 AM',
      verdict: 'Runtime Error',
      attempts: 2
    },
    {
      id: 4,
      problem: 'Valid Parentheses',
      language: 'Python',
      date: '12 Nov 2026, 02:45 PM',
      verdict: 'Accepted',
      attempts: 2
    }
  ])

  const filteredSubmissions = submissions.filter((submission) =>
    filter === 'All' || submission.verdict === filter
  )

  const acceptedCount = submissions.filter(
    (s) => s.verdict === 'Accepted'
  ).length

  return (
    <div className="submission-history">

      <header className="submission-header">
        <div>
          <p className="submission-label">STUDENT PORTAL</p>
          <h1>Submission History</h1>
          <p>Track your coding attempts and results.</p>
        </div>
      </header>

      <div className="submission-stats">

        <div className="submission-stat-card">
          <span>Total Submissions</span>
          <h2>{submissions.length}</h2>
        </div>

        <div className="submission-stat-card">
          <span>Accepted</span>
          <h2>{acceptedCount}</h2>
        </div>

        <div className="submission-stat-card">
          <span>Other Results</span>
          <h2>{submissions.length - acceptedCount}</h2>
        </div>

      </div>

      <section className="submission-table-section">

        <div className="submission-table-header">
          <h2>Recent Submissions</h2>

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="All">All Results</option>
            <option value="Accepted">Accepted</option>
            <option value="Wrong Answer">Wrong Answer</option>
            <option value="Runtime Error">Runtime Error</option>
          </select>
        </div>

        <div className="submission-table-wrapper">
          <table className="submission-table">

            <thead>
              <tr>
                <th>Problem</th>
                <th>Language</th>
                <th>Submitted At</th>
                <th>Verdict</th>
                <th>Attempts</th>
              </tr>
            </thead>

            <tbody>
              {filteredSubmissions.map((submission) => (
                <tr key={submission.id}>
                  <td>{submission.problem}</td>
                  <td>{submission.language}</td>
                  <td>{submission.date}</td>
                  <td>
                    <span className={`verdict ${submission.verdict.toLowerCase().replace(' ', '-')}`}>
                      {submission.verdict}
                    </span>
                  </td>
                  <td>{submission.attempts}</td>
                </tr>
              ))}
            </tbody>

          </table>

          {filteredSubmissions.length === 0 && (
            <p className="no-submissions">No submissions found.</p>
          )}
        </div>

      </section>

    </div>
  )
}

export default SubmissionHistory
