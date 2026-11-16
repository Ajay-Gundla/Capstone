
import { useState } from 'react'
import './OutputPanel.css'

function OutputPanel({
  result,
  customInput = '',
  onCustomInputChange,
  testCases = []
}) {
  const [activeTab, setActiveTab] = useState('testcases')

  const status = result?.status || 'Not Run'

  const getStatusClass = () => {
    const value = status.toLowerCase()

    if (value === 'accepted' || value === 'success') {
      return 'status-accepted'
    }

    if (value === 'wrong_answer' || value === 'wrong answer') {
      return 'status-wrong'
    }

    if (value === 'error' || value === 'runtime_error') {
      return 'status-error'
    }

    if (value === 'running') {
      return 'status-running'
    }

    return 'status-pending'
  }

  const results = result?.testCases || result?.results || []

  return (
    <div className="output-panel">

      {/* Header */}
      <div className="output-header">
        <h3>Test Results</h3>

        <span className={`execution-status ${getStatusClass()}`}>
          {status.replace('_', ' ')}
        </span>
      </div>

      {/* Tabs */}
      <div className="output-tabs">
        <button
          className={activeTab === 'testcases' ? 'active' : ''}
          onClick={() => setActiveTab('testcases')}
        >
          Test Cases
        </button>

        <button
          className={activeTab === 'custom' ? 'active' : ''}
          onClick={() => setActiveTab('custom')}
        >
          Custom Input
        </button>
      </div>

      {/* Test Cases */}
      {activeTab === 'testcases' && (
        <div className="test-results-section">

          {results.length > 0 ? (
            <div className="test-results-table-wrapper">
              <table className="test-results-table">
                <thead>
                  <tr>
                    <th>Test Case</th>
                    <th>Expected Output</th>
                    <th>Actual Output</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {results.map((item, index) => (
                    <tr key={item.id || index}>
                      <td>Test Case {index + 1}</td>

                      <td>
                        {item.expectedOutput ?? item.expected_output ?? '-'}
                      </td>

                      <td>
                        {item.actualOutput ?? item.actual_output ?? '-'}
                      </td>

                      <td>
                        <span
                          className={`test-case-status ${
                            item.status?.toLowerCase() === 'passed' ||
                            item.status?.toLowerCase() === 'accepted'
                              ? 'status-accepted'
                              : item.status?.toLowerCase() === 'failed' ||
                                item.status?.toLowerCase() === 'wrong_answer'
                                ? 'status-wrong'
                                : 'status-pending'
                          }`}
                        >
                          {item.status || 'Not Run'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="empty-test-cases">
              {testCases.length > 0
                ? 'Run your code to see test case results.'
                : 'No predefined test cases are available.'}
            </p>
          )}

        </div>
      )}

      {/* Custom Input */}
      {activeTab === 'custom' && (
        <div className="custom-input-section">
          <h4>Custom Input</h4>

          <textarea
            value={customInput}
            onChange={(e) => onCustomInputChange?.(e.target.value)}
            placeholder="Enter your test input here..."
            rows={5}
          />

          <p>
            Enter your own input to test your solution.
          </p>
        </div>
      )}

      {/* Execution Output */}
      <div className="output-content">

        {!result ? (
          <p>Run your code to see the output here.</p>
        ) : (
          <>
            <h4>{result.title || 'Execution Result'}</h4>

            {result.output !== undefined && (
              <pre className="program-output">
                {String(result.output)}
              </pre>
            )}

            {result.message && (
              <p>{result.message}</p>
            )}

            {result.error && (
              <pre className="program-error">
                {String(result.error)}
              </pre>
            )}

            {result.executionTime !== undefined && (
              <p className="execution-metadata">
                Runtime: {result.executionTime} ms
              </p>
            )}

            {result.memory !== undefined && (
              <p className="execution-metadata">
                Memory: {result.memory} KB
              </p>
            )}
          </>
        )}

      </div>
    </div>
  )
}

export default OutputPanel
