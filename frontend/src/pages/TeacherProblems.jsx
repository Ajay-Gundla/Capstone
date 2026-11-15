
import { useState } from 'react'
import './TeacherProblems.css'

const createTestCase = () => ({
  id: Date.now() + Math.random(),
  input: '',
  expectedOutput: ''
})

const emptyForm = () => ({
  title: '',
  difficulty: 'Easy',
  description: '',
  inputFormat: '',
  outputFormat: '',
  constraints: '',
  exampleInput: '',
  exampleOutput: '',
  tags: '',
  testCases: [createTestCase()]
})

function TeacherProblems() {
  const [search, setSearch] = useState('')
  const [difficulty, setDifficulty] = useState('All')
  const [status, setStatus] = useState('All')
  const [sortBy, setSortBy] = useState('Newest')
  const [showForm, setShowForm] = useState(false)
  const [selectedProblem, setSelectedProblem] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const [validationMessage, setValidationMessage] = useState('')

  const [problems, setProblems] = useState([
    {
      id: 1,
      title: 'Two Sum',
      difficulty: 'Easy',
      status: 'Published',
      description: 'Find two numbers that add up to a target.',
      inputFormat: 'An array of integers and a target integer.',
      outputFormat: 'Return the indices of the two numbers.',
      constraints: '2 <= nums.length <= 10^4',
      exampleInput: 'nums = [2, 7, 11, 15], target = 9',
      exampleOutput: '[0, 1]',
      tags: ['Array', 'Hash Table'],
      testCases: [
        {
          id: 1,
          input: '[2, 7, 11, 15], target = 9',
          expectedOutput: '[0, 1]'
        },
        {
          id: 2,
          input: '[3, 2, 4], target = 6',
          expectedOutput: '[1, 2]'
        }
      ],
      createdAt: '2026-11-10'
    },
    {
      id: 2,
      title: 'Reverse Linked List',
      difficulty: 'Medium',
      status: 'Draft',
      description: 'Reverse a singly linked list.',
      inputFormat: 'The head of a singly linked list.',
      outputFormat: 'Return the reversed linked list.',
      constraints: '0 <= number of nodes <= 5000',
      exampleInput: '1 -> 2 -> 3 -> 4 -> 5',
      exampleOutput: '5 -> 4 -> 3 -> 2 -> 1',
      tags: ['Linked List'],
      testCases: [
        {
          id: 1,
          input: '1 -> 2 -> 3',
          expectedOutput: '3 -> 2 -> 1'
        }
      ],
      createdAt: '2026-11-12'
    },
    {
      id: 3,
      title: 'Binary Tree Paths',
      difficulty: 'Hard',
      status: 'Published',
      description: 'Find all root-to-leaf paths in a binary tree.',
      inputFormat: 'The root node of a binary tree.',
      outputFormat: 'Return all root-to-leaf paths.',
      constraints: 'The number of nodes is between 1 and 100.',
      exampleInput: 'Root = [1, 2, 3, null, 5]',
      exampleOutput: '["1->2->5", "1->3"]',
      tags: ['Tree', 'DFS'],
      testCases: [
        {
          id: 1,
          input: '[1, 2, 3, null, 5]',
          expectedOutput: '["1->2->5", "1->3"]'
        }
      ],
      createdAt: '2026-11-14'
    }
  ])

  const [form, setForm] = useState(emptyForm())

  const filteredProblems = problems
    .filter((problem) => {
      const matchesSearch =
        problem.title.toLowerCase().includes(search.toLowerCase()) ||
        problem.description.toLowerCase().includes(search.toLowerCase()) ||
        problem.tags.join(' ').toLowerCase().includes(search.toLowerCase())

      const matchesDifficulty =
        difficulty === 'All' || problem.difficulty === difficulty

      const matchesStatus =
        status === 'All' || problem.status === status

      return matchesSearch && matchesDifficulty && matchesStatus
    })
    .sort((a, b) => {
      if (sortBy === 'A-Z') return a.title.localeCompare(b.title)
      if (sortBy === 'Z-A') return b.title.localeCompare(a.title)

      if (sortBy === 'Difficulty') {
        const levels = { Easy: 1, Medium: 2, Hard: 3 }
        return levels[a.difficulty] - levels[b.difficulty]
      }

      return b.id - a.id
    })

  const totalProblems = problems.length

  const publishedCount = problems.filter(
    (p) => p.status === 'Published'
  ).length

  const draftCount = totalProblems - publishedCount

  const resetForm = () => {
    setForm(emptyForm())
    setEditingId(null)
    setValidationMessage('')
    setShowForm(false)
  }

  // Validate and save a problem
  const handleSubmit = (e, publish = false) => {
    e.preventDefault()

    if (!form.title.trim() || !form.description.trim()) {
      setValidationMessage(
        'Problem title and description are required.'
      )
      return
    }

    // Ignore completely blank test cases.
    // Reject partially completed test cases.
    const incompleteTestCase = form.testCases.some((testCase) => {
      const hasInput = testCase.input.trim() !== ''
      const hasOutput = testCase.expectedOutput.trim() !== ''

      return hasInput !== hasOutput
    })

    if (incompleteTestCase) {
      setValidationMessage(
        'Every test case must have both Input and Expected Output. Complete it or remove it.'
      )
      return
    }

    const validTestCases = form.testCases.filter(
      (testCase) =>
        testCase.input.trim() !== '' &&
        testCase.expectedOutput.trim() !== ''
    )

    if (publish && validTestCases.length === 0) {
      setValidationMessage(
        'Add at least one complete test case before publishing.'
      )
      return
    }

    const problemData = {
      ...form,
      title: form.title.trim(),
      tags: form.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean),
      testCases: validTestCases
    }

    if (editingId !== null) {
      setProblems((previous) =>
        previous.map((problem) =>
          problem.id === editingId
            ? {
                ...problem,
                ...problemData,
                status: publish ? 'Published' : problem.status
              }
            : problem
        )
      )
    } else {
      setProblems((previous) => [
        ...previous,
        {
          id: Date.now(),
          ...problemData,
          status: publish ? 'Published' : 'Draft',
          createdAt: new Date().toISOString().slice(0, 10)
        }
      ])
    }

    setValidationMessage('')
    resetForm()
  }

  // Edit an existing problem
  const handleEdit = (problem) => {
    setForm({
      title: problem.title,
      difficulty: problem.difficulty,
      description: problem.description || '',
      inputFormat: problem.inputFormat || '',
      outputFormat: problem.outputFormat || '',
      constraints: problem.constraints || '',
      exampleInput: problem.exampleInput || '',
      exampleOutput: problem.exampleOutput || '',
      tags: problem.tags.join(', '),
      testCases: problem.testCases?.length
        ? problem.testCases.map((testCase) => ({ ...testCase }))
        : [createTestCase()]
    })

    setValidationMessage('')
    setEditingId(problem.id)
    setSelectedProblem(null)
    setShowForm(true)
  }

  // Add a test case
  const addTestCase = () => {
    setForm((previous) => ({
      ...previous,
      testCases: [...previous.testCases, createTestCase()]
    }))
    setValidationMessage('')
  }

  // Update a test case
  const updateTestCase = (id, field, value) => {
    setForm((previous) => ({
      ...previous,
      testCases: previous.testCases.map((testCase) =>
        testCase.id === id
          ? { ...testCase, [field]: value }
          : testCase
      )
    }))
    setValidationMessage('')
  }

  // Remove a test case
  const removeTestCase = (id) => {
    setForm((previous) => ({
      ...previous,
      testCases: previous.testCases.filter(
        (testCase) => testCase.id !== id
      )
    }))
    setValidationMessage('')
  }

  // Open delete confirmation
  const handleDelete = (problem) => {
    setDeleteTarget(problem)
  }

  // Confirm deletion
  const confirmDelete = () => {
    if (!deleteTarget) return

    setProblems((previous) =>
      previous.filter((p) => p.id !== deleteTarget.id)
    )

    setSelectedProblem(null)
    setDeleteTarget(null)
  }

  // Publish or unpublish
  const togglePublish = (problem) => {
    setProblems((previous) =>
      previous.map((p) =>
        p.id === problem.id
          ? {
              ...p,
              status: p.status === 'Draft' ? 'Published' : 'Draft'
            }
          : p
      )
    )
  }

  return (
    <div className="teacher-problems">

      {/* Header */}
      <div className="teacher-problems-header">
        <div>
          <h1>Problem Management</h1>
          <p>Create, search, review and manage coding problems.</p>
        </div>

        <button className="add-problem-button">
          + Create Problem
        </button>
      </div>

        <button
          className="add-problem-button"
          onClick={() => {
            resetForm()
            setShowForm(true)
          }}
        >
          + Create Problem
        </button>
      </div>

      {/* Statistics */}
      <section className="problem-management-stats">
        <div className="admin-stat-card">
          <span>Total Problems</span>
          <h2>{totalProblems}</h2>
        </div>

        <div className="admin-stat-card">
          <span>Published</span>
          <h2>{publishedCount}</h2>
        </div>

        <div className="admin-stat-card">
          <span>Drafts</span>
          <h2>{draftCount}</h2>
        </div>
      </section>

      {/* Create and Edit Form */}
      {showForm && (
        <form
          className="manage-problem-form"
          onSubmit={(e) => handleSubmit(e, false)}
        >
          <h2>
            {editingId !== null ? 'Edit Problem' : 'Create New Problem'}
          </h2>

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

          <label>Problem Description</label>
          <textarea
            placeholder="Explain the problem clearly..."
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
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

          <label>Input Format</label>
          <textarea
            placeholder="Explain what input the user should provide..."
            value={form.inputFormat}
            onChange={(e) =>
              setForm({ ...form, inputFormat: e.target.value })
            }
          />

          <label>Output Format</label>
          <textarea
            placeholder="Explain what output the program should produce..."
            value={form.outputFormat}
            onChange={(e) =>
              setForm({ ...form, outputFormat: e.target.value })
            }
          />

          <label>Constraints</label>
          <textarea
            placeholder="Example: 1 <= n <= 100000"
            value={form.constraints}
            onChange={(e) =>
              setForm({ ...form, constraints: e.target.value })
            }
          />

          <label>Example Input</label>
          <textarea
            placeholder="Enter example input..."
            value={form.exampleInput}
            onChange={(e) =>
              setForm({ ...form, exampleInput: e.target.value })
            }
          />

          <label>Example Output</label>
          <textarea
            placeholder="Enter expected output..."
            value={form.exampleOutput}
            onChange={(e) =>
              setForm({ ...form, exampleOutput: e.target.value })
            }
          />

          <label>Tags</label>
          <input
            type="text"
            placeholder="Array, Hash Table, Tree, DP"
            value={form.tags}
            onChange={(e) =>
              setForm({ ...form, tags: e.target.value })
            }
          />
          <small>Separate multiple tags using commas.</small>

          {/* Test Case Manager */}
          <div className="test-case-manager">
            <div className="test-case-manager-header">
              <div>
                <h3>Test Cases</h3>
                <p>Add input and expected output for each test case.</p>
              </div>

              <button
                type="button"
                onClick={addTestCase}
                className="add-problem-button"
              >
                + Add Test Case
              </button>
            </div>

            {form.testCases.map((testCase, index) => (
              <div className="test-case-card" key={testCase.id}>
                <div className="test-case-card-header">
                  <h4>Test Case {index + 1}</h4>

                  <button
                    type="button"
                    onClick={() => removeTestCase(testCase.id)}
                  >
                    Remove
                  </button>
                </div>

                <label>Input</label>
                <textarea
                  placeholder="Enter test case input..."
                  value={testCase.input}
                  onChange={(e) =>
                    updateTestCase(
                      testCase.id,
                      'input',
                      e.target.value
                    )
                  }
                />

                <label>Expected Output</label>
                <textarea
                  placeholder="Enter expected output..."
                  value={testCase.expectedOutput}
                  onChange={(e) =>
                    updateTestCase(
                      testCase.id,
                      'expectedOutput',
                      e.target.value
                    )
                  }
                />
              </div>
            ))}

            <p className="test-case-count">
              Total test cases: {form.testCases.length}
            </p>

            {validationMessage && (
              <p className="test-case-error">
                {validationMessage}
              </p>
            )}
          </div>

          {/* Form Actions */}
          <div className="problem-form-actions">
            <button type="submit" className="add-problem-button">
              Save as Draft
            </button>

            <button
              type="button"
              className="add-problem-button"
              onClick={(e) => {
                const formElement = e.currentTarget.closest('form')

                if (formElement && formElement.reportValidity()) {
                  handleSubmit(e, true)
                }
              }}
            >
              {editingId !== null
                ? 'Save Changes & Publish'
                : 'Publish Problem'}
            </button>

            <button type="button" onClick={resetForm}>
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* All Problems */}
      <section className="problem-list-container">
        <div className="problem-list-heading">
          <div>
            <h2>All Problems</h2>
            <p>{filteredProblems.length} problems found</p>
          </div>
        </div>

        {/* Filters */}
        <div className="teacher-problem-filters">
          <input
            type="text"
            placeholder="Search title, description or tags..."
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
            <option value="Published">Published</option>
            <option value="Draft">Draft</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="Newest">Newest First</option>
            <option value="A-Z">Name A-Z</option>
            <option value="Z-A">Name Z-A</option>
            <option value="Difficulty">Difficulty</option>
          </select>

          <button
            type="button"
            onClick={() => {
              setSearch('')
              setDifficulty('All')
              setStatus('All')
              setSortBy('Newest')
            }}
          >
            Clear Filters
          </button>
        </div>

        {/* Problem Rows */}
        <div className="teacher-problem-list">
          {filteredProblems.map((problem) => (
            <div className="teacher-problem-row" key={problem.id}>
              <div className="problem-main-info">
                <h3>{problem.title}</h3>

                <span>{problem.difficulty}</span>
                <span>{problem.status}</span>

                <p>{problem.description}</p>

                <div className="problem-tags">
                  {problem.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
              </div>

              <div className="teacher-problem-actions">
                <button onClick={() => setSelectedProblem(problem)}>
                  View
                </button>

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
            <p>No problems match your filters.</p>
          )}
        </div>
      </section>

      {/* View Problem Modal */}
      {selectedProblem && (
        <div className="problem-modal-overlay">
          <div className="problem-modal">
            <button
              className="problem-modal-close"
              onClick={() => setSelectedProblem(null)}
            >
              ×
            </button>

            <h2>{selectedProblem.title}</h2>

            <p>{selectedProblem.description}</p>

            <p>
              <strong>Difficulty:</strong> {selectedProblem.difficulty}
            </p>

            <p>
              <strong>Status:</strong> {selectedProblem.status}
            </p>

            <p>
              <strong>Input Format:</strong>{' '}
              {selectedProblem.inputFormat || 'Not added'}
            </p>

            <p>
              <strong>Output Format:</strong>{' '}
              {selectedProblem.outputFormat || 'Not added'}
            </p>

            <p>
              <strong>Constraints:</strong>{' '}
              {selectedProblem.constraints || 'Not added'}
            </p>

            <p><strong>Example Input:</strong></p>
            <pre>{selectedProblem.exampleInput || 'Not added'}</pre>

            <p><strong>Example Output:</strong></p>
            <pre>{selectedProblem.exampleOutput || 'Not added'}</pre>

            <p>
              <strong>Tags:</strong>{' '}
              {selectedProblem.tags.join(', ') || 'None'}
            </p>

            {/* Display Test Cases */}
            <div className="problem-modal-test-cases">
              <h3>Test Cases</h3>

              {selectedProblem.testCases?.length ? (
                selectedProblem.testCases.map((testCase, index) => (
                  <div className="test-case-card" key={testCase.id}>
                    <h4>Test Case {index + 1}</h4>

                    <p><strong>Input:</strong></p>
                    <pre>{testCase.input || 'Not added'}</pre>

                    <p><strong>Expected Output:</strong></p>
                    <pre>{testCase.expectedOutput || 'Not added'}</pre>
                  </div>
                ))
              ) : (
                <p>No test cases added.</p>
              )}
            </div>

            <div className="problem-form-actions">
              <button onClick={() => handleEdit(selectedProblem)}>
                Edit Problem
              </button>

              <button onClick={() => setSelectedProblem(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="problem-modal-overlay">
          <div className="problem-modal delete-modal">
            <button
              className="problem-modal-close"
              onClick={() => setDeleteTarget(null)}
            >
              ×
            </button>

            <h2>Delete Problem?</h2>

            <p>
              Are you sure you want to delete
              <strong> {deleteTarget.title}</strong>?
            </p>

            <p>This action cannot be undone.</p>

            <div className="problem-form-actions">
              <button onClick={() => setDeleteTarget(null)}>
                Cancel
              </button>

              <button
                className="confirm-delete-button"
                onClick={confirmDelete}
              >
                Delete Problem
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default TeacherProblems
