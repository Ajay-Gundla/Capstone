
import { useEffect, useState } from 'react'
import axios from 'axios'
import './ProblemList.css'

function ProblemList({ onSelectProblem }) {
  const [problems, setProblems] = useState([])
  const [search, setSearch] = useState('')
  const [difficulty, setDifficulty] = useState('All')
  const [status, setStatus] = useState('All')
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

        setProblems(response.data)
      } catch (err) {
        setError('Failed to load problems')
      } finally {
        setLoading(false)
      }
    }

    fetchProblems()
  }, [])

  const filteredProblems = problems.filter((problem) => {
    const matchesSearch = problem.title.toLowerCase().includes(search.toLowerCase())
    const matchesDifficulty = difficulty === 'All' || problem.difficulty === difficulty
    const matchesStatus = status === 'All' || status === (problem.status || 'Unsolved')

    return matchesSearch && matchesDifficulty && matchesStatus
  })

  if (loading) return <p>Loading problems...</p>
  if (error) return <p>{error}</p>

  return (
    <div className="problem-section">
      <h2>Problems</h2>

      <div className="problem-filters">
        <input
          type="text"
          placeholder="Search problems..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
          <option value="All">All Difficulties</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>

        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="All">All Status</option>
          <option value="Solved">Solved</option>
          <option value="Unsolved">Unsolved</option>
        </select>
      </div>

      {filteredProblems.map((problem) => (
        <div
          className="problem-row"
          key={problem.id}
          onClick={() => onSelectProblem(problem.slug)}
          style={{ cursor: 'pointer' }}
        >
          <span className="problem-title">{problem.title}</span>
          <span className={problem.difficulty.toLowerCase()}>
            {problem.difficulty}
          </span>
          <span className="unsolved">Unsolved</span>
        </div>
      ))}

      {filteredProblems.length === 0 && <p>No problems found.</p>}
    </div>
  )
}

export default ProblemList
