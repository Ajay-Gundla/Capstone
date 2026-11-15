
import { useEffect, useState } from 'react'
import axios from 'axios'
import './ProblemList.css'

function ProblemList({ onSelectProblem }) {
  const [problems, setProblems] = useState([])
  const [search, setSearch] = useState('')
  const [difficulty, setDifficulty] = useState('All')
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

        // Students should only see published problems.
        const publishedProblems = receivedProblems.filter(
          (problem) => problem.status !== 'Draft'
        )

        setProblems(publishedProblems)
      } catch (err) {
        setError('Failed to load problems. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchProblems()
  }, [])

  const filteredProblems = problems.filter((problem) => {
    const searchText = search.toLowerCase()

    const matchesSearch =
      (problem.title || '').toLowerCase().includes(searchText) ||
      (problem.description || '').toLowerCase().includes(searchText) ||
      (Array.isArray(problem.tags)
        ? problem.tags.join(' ').toLowerCase().includes(searchText)
        : false)

    const matchesDifficulty =
      difficulty === 'All' || problem.difficulty === difficulty

    return matchesSearch && matchesDifficulty
  })

  if (loading) {
    return (
      <div className="problem-section">
        <p>Loading problems...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="problem-section">
        <p>{error}</p>
      </div>
    )
  }

  return (
    <div className="problem-section">

      {/* Header */}
      <div className="student-problems-header">
        <div>
          <h2>Practice Problems</h2>
          <p>Solve problems and improve your coding skills.</p>
        </div>

        <span className="problem-total">
          {filteredProblems.length} Problems
        </span>
      </div>

      {/* Filters */}
      <div className="problem-filters">
        <input
          type="text"
          placeholder="Search by title, description or tags..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
        >
          <option value="All">All Difficulties</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>

        <button
          type="button"
          onClick={() => {
            setSearch('')
            setDifficulty('All')
          }}
        >
          Clear Filters
        </button>
      </div>

      {/* Problem List */}
      <div className="student-problem-list">

        {filteredProblems.map((problem) => (
          <div className="student-problem-card" key={problem.id}>

            <div className="student-problem-info">
              <h3>{problem.title}</h3>

              <p>
                {problem.description || 'No description available.'}
              </p>

              <div className="student-problem-tags">
                {Array.isArray(problem.tags) &&
                  problem.tags.map((tag, index) => (
                    <span key={`${tag}-${index}`}>
                      {tag}
                    </span>
                  ))}
              </div>
            </div>

            <div className="student-problem-right">
              <span
                className={`problem-difficulty ${(
                  problem.difficulty || 'Easy'
                ).toLowerCase()}`}
              >
                {problem.difficulty || 'Easy'}
              </span>

              <button
                type="button"
                onClick={() =>
                  onSelectProblem(problem.slug || problem.id)
                }
              >
                Solve Problem
              </button>
            </div>

          </div>
        ))}

        {filteredProblems.length === 0 && (
          <div className="no-problems-message">
            <h3>No problems found</h3>
            <p>Try changing your search or difficulty filter.</p>
          </div>
        )}

      </div>
    </div>
  )
}

export default ProblemList
