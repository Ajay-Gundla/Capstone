
import { useState } from 'react'
import './OutputPanel.css'

function OutputPanel({
  result,
  customInput = '',
  onCustomInputChange,
  testCases = []
}) {
  const [activeTab, setActiveTab] = useState('testcases')

  const getStatus = () => {
    if (!result) return 'Not Run'
    return 'Unavailable'
  }

  return (
    <div className="output-panel">
      <div className="output-header">
        <h3>Test Results</h3>
        <span>{getStatus()}</span>
      </div>

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

      {activeTab === 'testcases' && (
        <div className="test-results-section">
          {testCases.length > 0 ? (
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
                  {testCases.map((testCase, index) => (
                    <tr key={index}>
                      <td>Test Case {index + 1}</td>
                      <td>{testCase.expectedOutput}</td>
                      <td>Pending</td>
                      <td>
                        <span className="pending-status">
                          Not Run
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="empty-test-cases">
              No predefined test cases are available.
            </p>
          )}
        </div>
      )}

      {activeTab === 'custom' && (
        <div className="custom-input-section">
          <h4>Custom Input</h4>

          <textarea
            value={customInput}
            onChange={(e) => onCustomInputChange?.(e.target.value)}
            placeholder="Enter your test input here..."
            rows={4}
          />

          <p>Enter the input you want to test with your code.</p>
        </div>
      )}

      <div className="output-content">
        {!result ? (
          <p>Run your code to see the output here.</p>
        ) : (
          <>
            <h4>{result.title}</h4>
            <p>{result.message}</p>
          </>
        )}
      </div>
    </div>
  )
}

export default OutputPanel
