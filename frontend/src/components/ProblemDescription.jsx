
import { useEffect, useState } from 'react'
import axios from 'axios'
import './ProblemDescription.css'

function ProblemDescription({ problemSlug, onProblemLoaded }) {
  const [problem, setProblem] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        setLoading(true)
        setError('')

        const token = localStorage.getItem('token')

        const response = await axios.get(
          `http://localhost:5001/api/problems/${problemSlug}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )

        setProblem(response.data)
        onProblemLoaded?.(response.data)
      } catch (err) {
        setError('Failed to load problem')
      } finally {
        setLoading(false)
      }
    }

    fetchProblem()
  }, [problemSlug, onProblemLoaded])

  if (loading) return <p>Loading problem...</p>
  if (error) return <p>{error}</p>
  if (!problem) return <p>Problem not found</p>

  return (
    <div className="problem-description">
      <h2>{problem.title}</h2>

      <div className="problem-meta">
        <span>{problem.difficulty}</span>
      </div>

      <h3>Problem</h3>
      <p>{problem.description}</p>

      {(problem.examples || []).map((example) => (
        <div key={example.example_number}>
          <h3>Example {example.example_number}</h3>

          <div className="example-box">
            <p>Input: {example.input}</p>
            <p>Output: {example.expected_output}</p>
            <p>Explanation: {example.explanation}</p>
          </div>
        </div>
      ))}

      <h3>Constraints</h3>
      <p>{problem.constraints}</p>
    </div>
  )
}

export default ProblemDescription
