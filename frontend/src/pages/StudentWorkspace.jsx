
import { useEffect, useState } from 'react'
import ProblemDescription from '../components/ProblemDescription'
import CodeEditor from '../components/CodeEditor'
import OutputPanel from '../components/OutputPanel'
import './StudentWorkspace.css'

function StudentWorkspace({ problemSlug }) {
  const storageKey = `algopilot_attempts_${problemSlug}`

  const [executionResult, setExecutionResult] = useState(null)
  const [customInput, setCustomInput] = useState('')
  const [problemData, setProblemData] = useState(null)
  const [isRunning, setIsRunning] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [attempts, setAttempts] = useState(() => {
    try {
      const savedAttempts = localStorage.getItem(storageKey)
      return savedAttempts ? JSON.parse(savedAttempts) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    try {
      const savedAttempts = localStorage.getItem(storageKey)
      setAttempts(savedAttempts ? JSON.parse(savedAttempts) : [])
    } catch {
      setAttempts([])
    }
  }, [storageKey])

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(attempts))
  }, [storageKey, attempts])

  const handleRun = ({ code, language }) => {
    setIsRunning(true)

    setExecutionResult({
      status: 'unavailable',
      title: 'Execution service not connected',
      message: `Your ${language} code and custom input have been captured, but execution is unavailable until the backend execution API is connected.`
    })

    setIsRunning(false)
  }

  const handleSubmit = ({ code, language }) => {
    setIsSubmitting(true)

    const newAttempt = {
      id: Date.now(),
      problem: problemData?.title || problemSlug,
      language,
      date: new Date().toLocaleString(),
      verdict: 'Not Submitted',
      note: 'Submission service is not connected.'
    }

    setAttempts((previousAttempts) => [
      newAttempt,
      ...previousAttempts
    ])

    setExecutionResult({
      status: 'unavailable',
      title: 'Submission service not connected',
      message: `Your ${language} solution has not been submitted. The backend submission API is not available yet.`
    })

    setIsSubmitting(false)
  }

  const testCases = (problemData?.examples || []).map((example) => ({
    input: example.input,
    expectedOutput: example.expected_output
  }))

  return (
    <div className="workspace">
      <div className="workspace-left">
        <ProblemDescription
          problemSlug={problemSlug}
          onProblemLoaded={setProblemData}
        />
      </div>

      <div className="workspace-right">
        <CodeEditor
          key={problemSlug}
          problemSlug={problemSlug}
          onRun={handleRun}
          onSubmit={handleSubmit}
          isRunning={isRunning}
          isSubmitting={isSubmitting}
        />

        <OutputPanel
          result={executionResult}
          customInput={customInput}
          onCustomInputChange={setCustomInput}
          testCases={testCases}
        />

        <div className="recent-attempts">
          <div className="recent-attempts-header">
            <h3>Recent Attempts</h3>
            <span>{attempts.length} attempts</span>
          </div>

          {attempts.length === 0 ? (
            <p className="no-attempts">
              No attempts yet. Click Submit to record an attempt here.
            </p>
          ) : (
            <div className="attempt-list">
              {attempts.map((attempt) => (
                <div className="attempt-item" key={attempt.id}>
                  <div className="attempt-details">
                    <strong>{attempt.problem}</strong>
                    <span>
                      {attempt.language} · {attempt.date}
                    </span>
                    <small>{attempt.note}</small>
                  </div>

                  <span className="attempt-verdict">
                    {attempt.verdict}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default StudentWorkspace
