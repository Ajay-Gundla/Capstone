
import { useEffect, useState } from 'react'
import axios from 'axios'
import { submissions } from '../data/submissions'
import './LearningPath.css'

function LearningPath() {
  const [problems, setProblems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

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
      } catch (err) {
        setError('Failed to load your learning path.')
      } finally {
        setLoading(false)
      }
    }

    fetchProblems()
  }, [])

  // Find accepted submissions.
  const solvedProblems = new Set(
    submissions
      .filter((submission) => submission.verdict === 'Accepted')
      .map((submission) => submission.problem)
  )

  // Collect all unique topics.
  const topics = [
    ...new Set(
      problems.flatMap((problem) =>
        Array.isArray(problem.tags) ? problem.tags : []
      )
    )
  ]

  // Calculate progress for each topic.
  const learningTopics = topics.map((topic) => {
    const topicProblems = problems.filter(
      (problem) =>
        Array.isArray(problem.tags) &&
        problem.tags.includes(topic)
    )

    const solvedCount = topicProblems.filter(
      (problem) => solvedProblems.has(problem.title)
    ).length

    const totalCount = topicProblems.length

    const percentage =
      totalCount === 0
        ? 0
        : Math.round((solvedCount / totalCount) * 100)

    return {
      topic,
      total: totalCount,
      solved: solvedCount,
      percentage,
      completed: totalCount > 0 && solvedCount === totalCount
    }
  })

  // Find the next incomplete topic.
  const nextTopic = learningTopics.find(
    (item) => !item.completed
  )

  if (loading) {
    return (
      <div className="learning-path-page">
        <p>Loading your learning path...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="learning-path-page">
        <p>{error}</p>
      </div>
    )
  }

  if (learningTopics.length === 0) {
    return (
      <div className="learning-path-page">
        <h2>Your Learning Path</h2>
        <p>No topics are available yet. Check back when problems are added.</p>
      </div>
    )
  }

  const completedTopics = learningTopics.filter(
    (item) => item.completed
  ).length

  const overallProgress = Math.round(
    (completedTopics / learningTopics.length) * 100
  )

  return (
    <div className="learning-path-page">

      {/* Header */}
      <div className="learning-path-header">
        <div>
          <h2>Your Learning Path</h2>
          <p>Follow your progress and discover what to learn next.</p>
        </div>
      </div>

      {/* Overall Progress */}
      <div className="learning-overview">
        <div>
          <h3>{completedTopics} / {learningTopics.length}</h3>
          <p>Topics Completed</p>
        </div>

        <div>
          <h3>{overallProgress}%</h3>
          <p>Overall Progress</p>
        </div>

        <div className="learning-overview-track">
          <div
            className="learning-overview-fill"
            style={{ width: `${overallProgress}%` }}
          />
        </div>
      </div>

      {/* Next Topic */}
      {nextTopic && (
        <div className="next-learning-topic">
          <span className="next-topic-label">NEXT TO LEARN</span>
          <h3>{nextTopic.topic}</h3>
          <p>
            You have completed {nextTopic.solved} out of {nextTopic.total}
            {' '}problems in this topic.
          </p>
          <div className="next-topic-progress">
            <div
              style={{ width: `${nextTopic.percentage}%` }}
            />
          </div>
        </div>
      )}

      {/* All Topics */}
      <div className="learning-topics-section">
        <h3>Learning Topics</h3>

        <div className="learning-topics-list">
          {learningTopics.map((item, index) => (
            <div className="learning-topic-card" key={item.topic}>

              <div className="learning-topic-number">
                {item.completed ? '✓' : index + 1}
              </div>

              <div className="learning-topic-info">
                <div className="learning-topic-heading">
                  <h4>{item.topic}</h4>

                  <span
                    className={
                      item.completed
                        ? 'learning-status completed'
                        : item === nextTopic
                          ? 'learning-status next'
                          : 'learning-status upcoming'
                    }
                  >
                    {item.completed
                      ? 'Completed'
                      : item === nextTopic
                        ? 'Next to learn'
                        : 'Upcoming'}
                  </span>
                </div>

                <p>
                  {item.solved} of {item.total} problems solved
                </p>

                <div className="learning-topic-track">
                  <div
                    className="learning-topic-fill"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>

                <span className="learning-topic-percentage">
                  {item.percentage}% completed
                </span>
              </div>

            </div>
          ))}
        </div>
      </div>

    </div>
  )
}

export default LearningPath
