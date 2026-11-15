
import { useEffect, useState } from 'react'
import axios from 'axios'
import './StudentProgress.css'
import { submissions } from '../data/submissions'

function StudentProgress({ onViewAllSubmissions }) {
  const [problems, setProblems] = useState([])
  const [loadingProblems, setLoadingProblems] = useState(true)

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const token = localStorage.getItem('token')

        const response = await axios.get(
          'http://localhost:5001/api/problems',
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )

        const receivedProblems = Array.isArray(response.data)
          ? response.data
          : response.data.problems || []

        const publishedProblems = receivedProblems.filter(
          (problem) =>
            String(problem.status || '').toLowerCase() !== 'draft'
        )

        setProblems(publishedProblems)
      } catch (error) {
        console.error('Failed to load dashboard problems:', error)
      } finally {
        setLoadingProblems(false)
      }
    }

    fetchProblems()
  }, [])

  // Accepted submissions.
  const acceptedSubmissions = submissions.filter(
    (submission) => submission.verdict === 'Accepted'
  )

  const totalSubmissions = submissions.length

  const acceptanceRate = totalSubmissions === 0
    ? 0
    : Math.round(
        (acceptedSubmissions.length / totalSubmissions) * 100
      )

  // Match accepted submissions with published problems.
  const publishedProblemTitles = new Set(
    problems.map((problem) => problem.title)
  )

  const validAcceptedSubmissions = acceptedSubmissions.filter(
    (submission) =>
      publishedProblemTitles.has(submission.problem)
  )

  const uniqueSolvedProblems = new Set(
    validAcceptedSubmissions.map(
      (submission) => submission.problem
    )
  ).size

  // Difficulty calculations.
  const difficultyLevels = ['Easy', 'Medium', 'Hard']

  const difficulty = difficultyLevels.map((level) => {
    const problemsAtLevel = problems.filter(
      (problem) =>
        (problem.difficulty || 'Easy').toLowerCase() ===
        level.toLowerCase()
    )

    const titlesAtLevel = new Set(
      problemsAtLevel.map((problem) => problem.title)
    )

    const solvedProblems = new Set(
      validAcceptedSubmissions
        .filter((submission) =>
          titlesAtLevel.has(submission.problem)
        )
        .map((submission) => submission.problem)
    )

    return {
      name: level,
      solved: solvedProblems.size,
      total: problemsAtLevel.length
    }
  })

  // Date helper.
  const getDateKey = (date) => {
    return [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, '0'),
      String(date.getDate()).padStart(2, '0')
    ].join('-')
  }

  // Current streak.
  const submissionDates = new Set(
    submissions.map((submission) => {
      const date = new Date(submission.date)

      if (Number.isNaN(date.getTime())) return null

      return getDateKey(date)
    }).filter(Boolean)
  )

  const today = new Date()
  today.setHours(12, 0, 0, 0)

  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  const streakDate = new Date(today)

  if (!submissionDates.has(getDateKey(today))) {
    streakDate.setDate(streakDate.getDate() - 1)
  }

  let currentStreak = 0

  while (submissionDates.has(getDateKey(streakDate))) {
    currentStreak++
    streakDate.setDate(streakDate.getDate() - 1)
  }

  const stats = [
    {
      label: 'Problems Solved',
      value: loadingProblems ? '...' : uniqueSolvedProblems
    },
    {
      label: 'Total Submissions',
      value: totalSubmissions
    },
    {
      label: 'Acceptance Rate',
      value: `${acceptanceRate}%`
    },
    {
      label: 'Current Streak',
      value: `${currentStreak} days`
    }
  ]

  // Activity by date.
  const activityByDate = {}

  submissions.forEach((submission) => {
    const date = new Date(submission.date)

    if (Number.isNaN(date.getTime())) return

    const dateKey = getDateKey(date)

    if (!activityByDate[dateKey]) {
      activityByDate[dateKey] = {
        total: 0,
        accepted: 0
      }
    }

    activityByDate[dateKey].total++

    if (submission.verdict === 'Accepted') {
      activityByDate[dateKey].accepted++
    }
  })

  // Generate the last 12 weeks.
  const endDate = new Date()
  endDate.setHours(12, 0, 0, 0)

  const currentMonday = new Date(endDate)
  const day = currentMonday.getDay()

  currentMonday.setDate(
    currentMonday.getDate() - (day === 0 ? 6 : day - 1)
  )

  const startDate = new Date(currentMonday)
  startDate.setDate(startDate.getDate() - 77)

  const activity = []

  for (let i = 0; i < 84; i++) {
    const date = new Date(startDate)
    date.setDate(startDate.getDate() + i)

    const dateKey = getDateKey(date)

    const dayActivity = activityByDate[dateKey] || {
      total: 0,
      accepted: 0
    }

    activity.push({
      date: date.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      }),
      total: dayActivity.total,
      accepted: dayActivity.accepted
    })
  }

  const totalContributions = activity.reduce(
    (total, day) => total + day.total,
    0
  )

  const recentActivity = submissions.slice(0, 4)

  return (
    <div className="student-progress">

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

      {/* Difficulty */}
      <section className="difficulty-section">
        <h2>Problems by Difficulty</h2>

        {difficulty.map((item) => (
          <div className="difficulty-item" key={item.name}>
            <div className="difficulty-info">
              <strong>{item.name}</strong>
              <span>
                {loadingProblems
                  ? 'Loading...'
                  : `${item.solved} / ${item.total} solved`}
              </span>
            </div>

            <div className="progress-track">
              <div
                className="progress-fill"
                style={{
                  width:
                    !loadingProblems && item.total > 0
                      ? `${Math.min(
                          (item.solved / item.total) * 100,
                          100
                        )}%`
                      : '0%'
                }}
              />
            </div>
          </div>
        ))}
      </section>

      {/* Activity Heatmap */}
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
            {activity.map((day, index) => {
              const level = Math.min(day.total, 5)

              return (
                <div
                  key={index}
                  className={`heatmap-cell level-${level}`}
                  title={`${day.date} — ${day.total} submissions, ${day.accepted} accepted`}
                  aria-label={`${day.date}: ${day.total} submissions, ${day.accepted} accepted`}
                />
              )
            })}
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

          <button
            type="button"
            className="view-all-submissions"
            onClick={onViewAllSubmissions}
          >
            View All Submissions →
          </button>
        </div>

        <div className="recent-activity-list">
          {recentActivity.length === 0 ? (
            <p className="no-attempts">
              No submissions yet. Start solving problems!
            </p>
          ) : (
            recentActivity.map((item) => (
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
                  <p>{item.language} · {item.date}</p>
                </div>

                <span
                  className={`activity-verdict ${item.verdict
                    .toLowerCase()
                    .replace(' ', '-')}`}
                >
                  {item.verdict}
                </span>
              </div>
            ))
          )}
        </div>
      </section>

    </div>
  )
}

export default StudentProgress
