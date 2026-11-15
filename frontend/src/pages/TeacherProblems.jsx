
import { useState } from 'react'
import './TeacherProblems.css'

function TeacherProblems() {
  const [search, setSearch] = useState('')
  const [difficulty, setDifficulty] = useState('All')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)

  const [problems, setProblems] = useState([
    { id: 1, title: 'Two Sum', difficulty: 'Easy', status: 'Published' },
    { id: 2, title: 'Reverse Linked List', difficulty: 'Medium', status: 'Draft' },
    { id: 3, title: 'Binary Tree Paths', difficulty: 'Hard', status: 'Published' },
  ])

  const [form, setForm] = useState({
    title: '',
    difficulty: 'Easy'
  })

  const filteredProblems = problems.filter((problem) => {
    const matchesSearch = problem.title
      .toLowerCase()
      .includes(search.toLowerCase())

    const matchesDifficulty =
      difficulty === 'All' || problem.difficulty === difficulty

    return matchesSearch && matchesDifficulty
  })

  const handleSubmit = (e) => {
    e.preventDefault()

    if (editingId !== null) {
      setProblems(problems.map((problem) =>
        problem.id === editingId
          ? { ...problem, ...form }
          : problem
      ))
    } else {
      setProblems([
        ...problems,
        {
          id: Date.now(),
          ...form,
          status: 'Draft'
        }
      ])
    }

    setForm({ title: '', difficulty: 'Easy' })
    setEditingId(null)
    setShowForm(false)
  }

  const handleEdit = (problem) => {
    setForm({
      title: problem.title,
      difficulty: problem.difficulty
    })

    setEditingId(problem.id)
    setShowForm(true)
  }

  const handleDelete = (problem) => {
    const confirmed = window.confirm(
      `Delete "${problem.title}"?`
    )

    if (confirmed) {
      setProblems(problems.filter(
        (p) => p.id !== problem.id
      ))
    }
  }

  const togglePublish = (problem) => {
    setProblems(problems.map((p) =>
      p.id === problem.id
        ? {
            ...p,
            status: p.status === 'Draft' ? 'Published' : 'Draft'
          }
        : p
    ))
  }

  return (
    <div className="teacher-problems">

      <div className="teacher-problems-header">
        <div>
          <h1>Manage Problems</h1>
          <p>Create, edit and manage your coding problems.</p>
        </div>

        <button
          className="add-problem-button"
          onClick={() => {
            setForm({ title: '', difficulty: 'Easy' })
            setEditingId(null)
            setShowForm(!showForm)
          }}
        >
          {showForm ? 'Cancel' : '+ Create Problem'}
        </button>
      </div>

      {showForm && (
        <form className="manage-problem-form" onSubmit={handleSubmit}>
          <h2>{editingId !== null ? 'Edit Problem' : 'Create New Problem'}</h2>

          <label>Problem Title</label>
          <input
            type="text"
            placeholder="Enter problem title"
            value={form.title}
            onChange={(e) =>
              setForm({ ...form, title: e.target.value })
            }
            required
          />

          <label>Difficulty</label>
          <select
            value={form.difficulty}
            onChange={(e) =>
              setForm({ ...form, difficulty: e.target.value })
            }
          >
            <option>Easy</option>
            <option>Medium</option>
            <option>Hard</option>
          </select>

          <button type="submit" className="add-problem-button">
            {editingId !== null ? 'Save Changes' : 'Save as Draft'}
          </button>
        </form>
      )}

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

              <button onClick={() => handleEdit(problem)}>
                Edit
              </button>

              <button onClick={() => togglePublish(problem)}>
                {problem.status === 'Draft' ? 'Publish' : 'Unpublish'}
              </button>

              <button onClick={() => handleDelete(problem)}>
                Delete
              </button>
            </div>
          </div>
        ))}

        {filteredProblems.length === 0 && (
          <p>No problems found.</p>
        )}
      </div>

    </div>
  )
}

export default TeacherProblems
