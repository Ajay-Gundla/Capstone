
import { useEffect, useState } from 'react'
import axios from 'axios'
import { submissions } from '../data/submissions'
import './ProblemList.css'

function ProblemList({ onSelectProblem }) {
  const [problems, setProblems] = useState([])
  const [search, setSearch] = useState('')
  const [difficulty, setDifficulty] = useState('All')
  const [status, setStatus] = useState('All')
  const [topic, setTopic] = useState('All')
  const [sortBy, setSortBy] = useState('title-asc')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedProblem, setSelectedProblem] = useState(null)

  // Normalize problem data received from the backend.
  const formatProblem = (problem) => {
    const examples = Array.isArray(problem.examples)
      ? problem.examples
      : []

    const firstExample = examples[0] || {}

    return {
      ...problem,

      tags: Array.isArray(problem.tags)
        ? problem.tags
        : [],

      examples,

      inputFormat:
        problem.inputFormat ||
        problem.input_format ||
        '',

      outputFormat:
        problem.outputFormat ||
        problem.output_format ||
        '',

      exampleInput:
        problem.exampleInput ||
        firstExample.input ||
        '',

      exampleOutput:
        problem.exampleOutput ||
        firstExample.expected_output ||
        firstExample.expectedOutput ||
        ''
    }
  }

  // Fetch published problems from API.
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

        const formattedProblems = receivedProblems.map(formatProblem)

        const publishedProblems = formattedProblems.filter(
          (problem) =>
            String(problem.status || '').toLowerCase() !== 'draft'
        )

        console.log('Student API problems:', publishedProblems)

        setProblems(publishedProblems)
      } catch (err) {
        console.error('Failed to fetch problems:', err)
        setError('Failed to load problems. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchProblems()
  }, [])

  // Identify solved problems.
  const solvedProblems = new Set(
    submissions
      .filter((submission) => submission.verdict === 'Accepted')
      .map((submission) => submission.problem)
  )

  // Overall completion statistics.
  const totalProblems = problems.length

  const solvedCount = problems.filter(
    (problem) => solvedProblems.has(problem.title)
  ).length

  const unsolvedCount = totalProblems - solvedCount

  const completionPercentage =
    totalProblems === 0
      ? 0
      : Math.round((solvedCount / totalProblems) * 100)

  // Submission statistics for each problem.
  const getProblemStats = (problemTitle) => {
    const problemSubmissions = submissions.filter(
      (submission) => submission.problem === problemTitle
    )

    const totalSubmissions = problemSubmissions.length

    const acceptedSubmissions = problemSubmissions.filter(
      (submission) => submission.verdict === 'Accepted'
    ).length

    const acceptanceRate =
      totalSubmissions === 0
        ? 0
        : Math.round(
            (acceptedSubmissions / totalSubmissions) * 100
          )

    return {
      totalSubmissions,
      acceptanceRate
    }
  }

  // Difficulty-wise progress.
  const difficultyOrder = {
    Easy: 1,
    Medium: 2,
    Hard: 3
  }

  const difficultyStats = ['Easy', 'Medium', 'Hard'].map((level) => {
    const levelProblems = problems.filter(
      (problem) => problem.difficulty === level
    )

    const levelSolved = levelProblems.filter(
      (problem) => solvedProblems.has(problem.title)
    ).length

    const levelTotal = levelProblems.length

    return {
      level,
      total: levelTotal,
      solved: levelSolved,
      percentage:
        levelTotal === 0
          ? 0
          : Math.round((levelSolved / levelTotal) * 100)
    }
  })

  // Generate unique topics from problem tags.
  const availableTopics = [
    ...new Set(
      problems.flatMap((problem) =>
        Array.isArray(problem.tags) ? problem.tags : []
      )
    )
  ].sort()

  // Identify topics from previously attempted problems.
  const practicedTopics = new Set(
    submissions.flatMap((submission) => {
      const matchingProblem = problems.find(
        (problem) => problem.title === submission.problem
      )

      return matchingProblem && Array.isArray(matchingProblem.tags)
        ? matchingProblem.tags
        : []
    })
  )

  // Recommend unsolved problems.
  const recommendedProblems = [...problems]
    .filter((problem) => !solvedProblems.has(problem.title))
    .sort((a, b) => {
      const aTags = Array.isArray(a.tags) ? a.tags : []
      const bTags = Array.isArray(b.tags) ? b.tags : []

      const aTopicMatch = aTags.some((tag) =>
        practicedTopics.has(tag)
      )

      const bTopicMatch = bTags.some((tag) =>
        practicedTopics.has(tag)
      )

      if (aTopicMatch !== bTopicMatch) {
        return aTopicMatch ? -1 : 1
      }

      return (
        (difficultyOrder[a.difficulty] || 4) -
        (difficultyOrder[b.difficulty] || 4)
      )
    })
    .slice(0, 3)

  // Search and filter problems.
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

    const isSolved = solvedProblems.has(problem.title)

    const matchesStatus =
      status === 'All' ||
      (status === 'Solved' && isSolved) ||
      (status === 'Unsolved' && !isSolved)

    const matchesTopic =
      topic === 'All' ||
      (Array.isArray(problem.tags) && problem.tags.includes(topic))

    return (
      matchesSearch &&
      matchesDifficulty &&
      matchesStatus &&
      matchesTopic
    )
  })

  // Sort problems.
  const sortedProblems = [...filteredProblems].sort((a, b) => {
    if (sortBy === 'title-asc') {
      return (a.title || '').localeCompare(b.title || '')
    }

    if (sortBy === 'title-desc') {
      return (b.title || '').localeCompare(a.title || '')
    }

    if (sortBy === 'difficulty-asc') {
      return (
        (difficultyOrder[a.difficulty] || 4) -
        (difficultyOrder[b.difficulty] || 4)
      )
    }

    if (sortBy === 'difficulty-desc') {
      return (
        (difficultyOrder[b.difficulty] || 4) -
        (difficultyOrder[a.difficulty] || 4)
      )
    }

    return 0
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

      {/* Overall Completion Summary */}
      <div className="problem-summary-grid">
        <div className="problem-summary-card">
          <h3>{totalProblems}</h3>
          <p>Total Problems</p>
        </div>

        <div className="problem-summary-card">
          <h3>{solvedCount}</h3>
          <p>Solved</p>
        </div>

        <div className="problem-summary-card">
          <h3>{unsolvedCount}</h3>
          <p>Unsolved</p>
        </div>

        <div className="problem-summary-card">
          <h3>{completionPercentage}%</h3>
          <p>Completion</p>
        </div>
      </div>

      {/* Difficulty Progress */}
      <div className="difficulty-progress-section">
        <h3>Progress by Difficulty</h3>

        <div className="difficulty-progress-grid">
          {difficultyStats.map((item) => (
            <div className="difficulty-progress-card" key={item.level}>
              <div className="difficulty-progress-header">
                <span>{item.level}</span>
                <span>{item.solved} / {item.total} Solved</span>
              </div>

              <div className="difficulty-progress-track">
                <div
                  className="difficulty-progress-fill"
                  style={{ width: `${item.percentage}%` }}
                />
              </div>

              <p>{item.percentage}% completed</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recommended for You */}
      <div className="recommended-section">
        <div className="recommended-header">
          <div>
            <h2>Recommended for You</h2>
            <p>Problems selected based on your practice history.</p>
          </div>
        </div>

        {recommendedProblems.length > 0 ? (
          <div className="recommended-grid">
            {recommendedProblems.map((problem) => {
              const stats = getProblemStats(problem.title)

              const hasTopicMatch =
                Array.isArray(problem.tags) &&
                problem.tags.some((tag) => practicedTopics.has(tag))

              return (
                <div className="recommended-card" key={problem.id}>
                  <span
                    className={`problem-difficulty ${(
                      problem.difficulty || 'Easy'
                    ).toLowerCase()}`}
                  >
                    {problem.difficulty || 'Easy'}
                  </span>

                  <h3>{problem.title}</h3>

                  <p>
                    {problem.description || 'No description available.'}
                  </p>

                  <span className="recommendation-reason">
                    {hasTopicMatch
                      ? 'Based on your practiced topics'
                      : 'Recommended for continued practice'}
                  </span>

                  <div className="recommended-card-footer">
                    <span>{stats.totalSubmissions} Submissions</span>

                    <button
                      type="button"
                      onClick={() =>
                        onSelectProblem(problem.slug || problem.id)
                      }
                    >
                      Start Solving
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="no-problems-message">
            <h3>You're all caught up!</h3>
            <p>You have solved all currently available problems.</p>
          </div>
        )}
      </div>

      {/* Practice Problems Header */}
      <div className="student-problems-header">
        <div>
          <h2>Practice Problems</h2>
          <p>Solve problems and improve your coding skills.</p>
        </div>

        <span className="problem-total">
          {filteredProblems.length}{' '}
          {filteredProblems.length === 1 ? 'Problem' : 'Problems'}
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

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="All">All Statuses</option>
          <option value="Solved">Solved</option>
          <option value="Unsolved">Unsolved</option>
        </select>

        <select
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        >
          <option value="All">All Topics</option>

          {availableTopics.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="title-asc">Title: A to Z</option>
          <option value="title-desc">Title: Z to A</option>
          <option value="difficulty-asc">Difficulty: Easy to Hard</option>
          <option value="difficulty-desc">Difficulty: Hard to Easy</option>
        </select>

        <button
          type="button"
          onClick={() => {
            setSearch('')
            setDifficulty('All')
            setStatus('All')
            setTopic('All')
            setSortBy('title-asc')
          }}
        >
          Clear Filters
        </button>
      </div>

      {/* Problem List */}
      <div className="student-problem-list">
        {sortedProblems.map((problem) => {
          const isSolved = solvedProblems.has(problem.title)
          const stats = getProblemStats(problem.title)

          return (
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

                <div className="problem-submission-stats">
                  <span>{stats.totalSubmissions} Submissions</span>
                  <span>{stats.acceptanceRate}% Acceptance Rate</span>
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

                <span
                  className={`problem-solve-status ${
                    isSolved ? 'solved' : 'unsolved'
                  }`}
                >
                  {isSolved ? '✓ Solved' : 'Unsolved'}
                </span>

                <button
                  type="button"
                  className="view-details-button"
                  onClick={() => setSelectedProblem(problem)}
                >
                  View Details
                </button>

                <button
                  type="button"
                  onClick={() =>
                    onSelectProblem(problem.slug || problem.id)
                  }
                >
                  {isSolved ? 'Solve Again' : 'Solve Problem'}
                </button>
              </div>
            </div>
          )
        })}

        {sortedProblems.length === 0 && (
          <div className="no-problems-message">
            <h3>No problems found</h3>
            <p>Try changing your search or filters.</p>
          </div>
        )}
      </div>

      {/* Problem Details Modal */}
      {selectedProblem && (
        <div
          className="problem-modal-overlay"
          onClick={() => setSelectedProblem(null)}
        >
          <div
            className="problem-details-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="problem-modal-header">
              <h2>{selectedProblem.title}</h2>

              <button
                type="button"
                onClick={() => setSelectedProblem(null)}
              >
                ×
              </button>
            </div>

            <span
              className={`problem-difficulty ${(
                selectedProblem.difficulty || 'Easy'
              ).toLowerCase()}`}
            >
              {selectedProblem.difficulty || 'Easy'}
            </span>

            <div className="problem-modal-content">
              <h3>Description</h3>
              <p>
                {selectedProblem.description || 'No description available.'}
              </p>

              <h3>Topics</h3>
              <div className="student-problem-tags">
                {Array.isArray(selectedProblem.tags) &&
                  selectedProblem.tags.map((tag, index) => (
                    <span key={`${tag}-${index}`}>
                      {tag}
                    </span>
                  ))}
              </div>

              <h3>Constraints</h3>
              <p>
                {selectedProblem.constraints || 'No constraints provided.'}
              </p>

              <h3>Input Format</h3>
              <p>
                {selectedProblem.inputFormat || 'Not specified.'}
              </p>

              <h3>Output Format</h3>
              <p>
                {selectedProblem.outputFormat || 'Not specified.'}
              </p>

              <h3>Example Input</h3>
              <pre>
                {
                  selectedProblem.exampleInput ||
                  selectedProblem.examples?.[0]?.input ||
                  'No example available.'
                }
              </pre>

              <h3>Example Output</h3>
              <pre>
                {
                  selectedProblem.exampleOutput ||
                  selectedProblem.examples?.[0]?.expected_output ||
                  selectedProblem.examples?.[0]?.expectedOutput ||
                  'No example available.'
                }
              </pre>
            </div>

            <button
              type="button"
              className="modal-solve-button"
              onClick={() => {
                const slug =
                  selectedProblem.slug || selectedProblem.id

                setSelectedProblem(null)
                onSelectProblem(slug)
              }}
            >
              Solve This Problem
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProblemList
