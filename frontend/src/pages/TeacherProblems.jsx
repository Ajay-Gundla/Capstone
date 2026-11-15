
import { useState } from 'react'
import './TeacherProblems.css'

function TeacherProblems() {
  const [search, setSearch] = useState('')
  const [difficulty, setDifficulty] = useState('All')

  const problems = [
    { id: 1, title: 'Two Sum', difficulty: 'Easy', status: 'Published' },
    { id: 2, title: 'Reverse Linked List', difficulty: 'Medium', status: 'Draft' },
    { id: 3, title: 'Binary Tree Paths', difficulty: 'Hard', status: 'Published' },
  ]

  const filteredProblems = problems.filter((problem) => {
    const matchesSearch = problem.title.toLowerCase().includes(search.toLowerCase())
    const matchesDifficulty = difficulty === 'All' || problem.difficulty === difficulty

    return matchesSearch && matchesDifficulty
  })

  return (
    <div className="teacher-problems">
      <div className="teacher-problems-header">
        <div>
          <h1>Manage Problems</h1>
          <p>Create, edit and manage your coding problems.</p>
        </div>

        <button className="add-problem-button">
          + Create Problem
        </button>
      </div>

      <div className="teacher-problem-filters">
        <input
          type="text"
          placeholder="Search problems..."
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
      </div>

      <div className="teacher-problem-list">
        {filteredProblems.map((problem) => (
          <div className="teacher-problem-row" key={problem.id}>
            <div>
              <h3>{problem.title}</h3>
              <span>{problem.difficulty}</span>
            </div>

            <div className="teacher-problem-actions">
              <span>{problem.status}</span>
              <button>Edit</button>
            </div>
          </div>
        ))}

        {filteredProblems.length === 0 && <p>No problems found.</p>}
      </div>
    </div>
  )
}

export default TeacherProblems
