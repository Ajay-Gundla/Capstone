
import { useState } from 'react'
import './TeacherDashboard.css'

function TeacherDashboard({ user }) {
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)

  const [form, setForm] = useState({
    title: '',
    slug: '',
    description: '',
    difficulty: 'Easy',
    constraints: '',
    exampleInput: '',
    exampleOutput: ''
  })

  const [testCases, setTestCases] = useState([
    { input: '', expectedOutput: '' }
  ])

  const [problems, setProblems] = useState([])

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  const handleTestCaseChange = (index, field, value) => {
    const updatedTestCases = [...testCases]
    updatedTestCases[index][field] = value
    setTestCases(updatedTestCases)
    const updated = [...testCases]
    updated[index][field] = value
    setTestCases(updated)
  }

  const addTestCase = () => {
    setTestCases([
      ...testCases,
      { input: '', expectedOutput: '' }
    ])
  }

  const removeTestCase = (index) => {
    if (testCases.length === 1) return

    setTestCases(
      testCases.filter((_, i) => i !== index)
    )
    setTestCases(testCases.filter((_, i) => i !== index))
  }

  const resetForm = () => {
    setForm({
      title: '',
      slug: '',
      description: '',
      difficulty: 'Easy',
      constraints: '',
      exampleInput: '',
      exampleOutput: ''
    })

    setTestCases([
      { input: '', expectedOutput: '' }
    ])
    setTestCases([{ input: '', expectedOutput: '' }])
    setEditingId(null)
  }

  const handleCreateProblem = (e) => {
    e.preventDefault()

    const newProblem = {
      ...form,
      id: Date.now(),
      status: 'Draft',
      testCases: testCases
    }

    setProblems([...problems, newProblem])
    setShowForm(false)
    resetForm()
    if (editingId !== null) {
      setProblems(problems.map((problem) =>
        problem.id === editingId
          ? { ...form, id: editingId, status: problem.status, testCases: [...testCases] }
          : problem
      ))
    } else {
      const newProblem = {
        ...form,
        id: Date.now(),
        status: 'Draft',
        testCases: [...testCases]
      }

      setProblems([...problems, newProblem])
    }

    resetForm()
    setShowForm(false)
  }

  const handleEdit = (problem) => {
    setForm({
      title: problem.title,
      slug: problem.slug,
      description: problem.description,
      difficulty: problem.difficulty,
      constraints: problem.constraints,
      exampleInput: problem.exampleInput,
      exampleOutput: problem.exampleOutput
    })

    setTestCases([...problem.testCases])
    setEditingId(problem.id)
    setShowForm(true)

    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleCancel = () => {
    resetForm()
    setShowForm(false)
  }

  return (
    <div className="teacher-dashboard">

      <header className="dashboard-heading">
        <div>
          <p className="dashboard-label">TEACHER PORTAL</p>
          <h1>Welcome, {user?.name || 'Teacher'}</h1>
          <p>Manage your coding problems and test cases.</p>
        </div>
      </header>

      <div className="teacher-stats">
        <div className="stat-card">
          <span>Total Problems</span>
          <h2>{problems.length}</h2>
        </div>

        <div className="stat-card">
          <span>Published Problems</span>
          <h2>0</h2>
          <h2>{problems.filter(p => p.status === 'Published').length}</h2>
        </div>

        <div className="stat-card">
          <span>Draft Problems</span>
          <h2>{problems.length}</h2>
          <h2>{problems.filter(p => p.status === 'Draft').length}</h2>
        </div>
      </div>

      <section className="teacher-section">
        <div>
          <h2>Problem Management</h2>
          <p>Create and manage coding problems for students.</p>
        </div>

        <button
          className="create-problem-button"
          onClick={() => setShowForm(!showForm)}
          onClick={() => {
            if (showForm) {
              handleCancel()
            } else {
              resetForm()
              setShowForm(true)
            }
          }}
        >
          {showForm ? 'Cancel' : '+ Create Problem'}
        </button>
      </section>

      {showForm && (
        <section className="create-problem-form">
          <h2>Create New Problem</h2>
          <h2>{editingId !== null ? 'Edit Problem' : 'Create New Problem'}</h2>

          <form onSubmit={handleCreateProblem}>
            <label>Problem Title</label>
            <input
              name="title"
              placeholder="Example: Two Sum"
              value={form.title}
              onChange={handleChange}
              required
            />

            <label>Problem Slug</label>
            <input
              name="slug"
              placeholder="Example: two-sum"
              value={form.slug}
              onChange={handleChange}
              required
            />

            <label>Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              required
            />

            <label>Difficulty</label>
            <select
              name="difficulty"
              value={form.difficulty}
              onChange={handleChange}
            >
              <option>Easy</option>
              <option>Medium</option>
              <option>Hard</option>
            </select>

            <label>Constraints</label>
            <textarea
              name="constraints"
              value={form.constraints}
              onChange={handleChange}
            />

            <label>Example Input</label>
            <textarea
              name="exampleInput"
              value={form.exampleInput}
              onChange={handleChange}
            />

            <label>Example Output</label>
            <textarea
              name="exampleOutput"
              value={form.exampleOutput}
              onChange={handleChange}
            />

            <div className="test-case-section">
              <h3>Test Cases</h3>
              <p>Add input and expected output for each test case.</p>

              {testCases.map((testCase, index) => (
                <div className="test-case-card" key={index}>
                  <div className="test-case-heading">
                    <h4>Test Case {index + 1}</h4>

                    <button
                      type="button"
                      className="remove-test-case"
                      onClick={() => removeTestCase(index)}
                      disabled={testCases.length === 1}
                    >
                      Remove
                    </button>
                  </div>

                  <label>Input</label>
                  <textarea
                    placeholder="Enter test case input..."
                    value={testCase.input}
                    onChange={(e) =>
                      handleTestCaseChange(index, 'input', e.target.value)
                    }
                    required
                  />

                  <label>Expected Output</label>
                  <textarea
                    placeholder="Enter expected output..."
                    value={testCase.expectedOutput}
                    onChange={(e) =>
                      handleTestCaseChange(index, 'expectedOutput', e.target.value)
                    }
                    required
                  />
                </div>
              ))}

              <button
                type="button"
                className="add-test-case"
                onClick={addTestCase}
              >
                + Add Test Case
              </button>
            </div>

            <button
              type="submit"
              className="create-problem-button"
            >
              Save as Draft
            <button type="submit" className="create-problem-button">
              {editingId !== null ? 'Save Changes' : 'Save as Draft'}
            </button>
          </form>
        </section>
      )}

      <section className="teacher-problem-list">
        <h2>Your Problems</h2>

        {problems.length === 0 ? (
          <p>No problems created yet.</p>
        ) : (
          problems.map((problem) => (
            <div className="teacher-problem-card" key={problem.id}>
              <div>
                <h3>{problem.title}</h3>
                <p>
                  {problem.difficulty} · {problem.slug}
                  {' · '}
                  {problem.testCases.length} test cases
                </p>
              </div>

              <span>{problem.status}</span>
              <div className="problem-actions">
  <span>{problem.status}</span>

  <button
    type="button"
    className="edit-problem-button"
    onClick={() => handleEdit(problem)}
  >
    Edit
  </button>

  <button
    type="button"
    className="publish-problem-button"
    onClick={() => {
      setProblems(problems.map((p) =>
        p.id === problem.id
          ? {
              ...p,
              status: p.status === 'Draft' ? 'Published' : 'Draft'
            }
          : p
      ))
    }}
  >
    {problem.status === 'Draft' ? 'Publish' : 'Unpublish'}
  </button>

  <button
    type="button"
    className="delete-problem-button"
    onClick={() => {
      const confirmed = window.confirm(
        `Are you sure you want to delete "${problem.title}"?`
      )

      if (confirmed) {
        setProblems(problems.filter((p) => p.id !== problem.id))
      }
    }}
  >
    Delete
  </button>
</div>
            </div>
          ))
        )}
      </section>

    </div>
  )
}

export default TeacherDashboard
