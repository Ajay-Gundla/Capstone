
import { useEffect, useState } from 'react'
import Editor from '@monaco-editor/react'
import './CodeEditor.css'

const starterCode = 'def twoSum(nums, target):\n    pass'

function CodeEditor({
  problemSlug,
  onRun,
  onSubmit,
  isRunning = false,
  isSubmitting = false
}) {
  const storageKey = `algopilot_code_${problemSlug || 'default'}`

  const [language, setLanguage] = useState('python')
  const [code, setCode] = useState(starterCode)
  const [lastSaved, setLastSaved] = useState('')
  const [isSaved, setIsSaved] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [fontSize, setFontSize] = useState(14)

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey))
      setLanguage(saved?.language || 'python')
      setCode(saved?.code ?? starterCode)
      setLastSaved(saved?.savedAt || '')
      setIsSaved(Boolean(saved?.savedAt))
    } catch {
      setLanguage('python')
      setCode(starterCode)
      setLastSaved('')
      setIsSaved(false)
    }
  }, [storageKey])

  useEffect(() => {
    try {
      const existing = JSON.parse(
        localStorage.getItem(storageKey) || '{}'
      )

      localStorage.setItem(
        storageKey,
        JSON.stringify({
          code,
          language,
          savedAt: existing.savedAt || ''
        })
      )
    } catch (error) {
      console.error('Unable to autosave code:', error)
    }
  }, [storageKey, code, language])

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsFullscreen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  const handleSaveDraft = () => {
    const savedAt = new Date().toLocaleString()

    localStorage.setItem(
      storageKey,
      JSON.stringify({ code, language, savedAt })
    )

    setLastSaved(savedAt)
    setIsSaved(true)
  }

  const handleReset = () => {
    setCode(starterCode)
    setIsSaved(false)
    setLastSaved('')
  }

  const handleRestoreStarter = () => {
    setCode(starterCode)
    setIsSaved(false)
    setLastSaved('')

    localStorage.setItem(
      storageKey,
      JSON.stringify({
        code: starterCode,
        language,
        savedAt: ''
      })
    )
  }

  const handleRun = () => {
    onRun?.({ code, language })
  }

  const handleSubmit = () => {
    onSubmit?.({ code, language })
  }

  const increaseFontSize = () => {
    setFontSize((size) => Math.min(size + 1, 24))
  }

  const decreaseFontSize = () => {
    setFontSize((size) => Math.max(size - 1, 10))
  }

  const resetFontSize = () => {
    setFontSize(14)
  }

  return (
    <div className={`code-editor ${isFullscreen ? 'fullscreen-mode' : ''}`}>
      <div className="editor-toolbar">
        <select
          value={language}
          onChange={(e) => {
            setLanguage(e.target.value)
            setIsSaved(false)
          }}
        >
          <option value="python">Python</option>
          <option value="javascript">JavaScript</option>
          <option value="cpp">C++</option>
          <option value="java">Java</option>
        </select>

        <div className="editor-actions">
          <div className="font-controls">
            <button
              type="button"
              onClick={decreaseFontSize}
              disabled={fontSize <= 10}
              title="Decrease font size"
            >
              −
            </button>

            <button
              type="button"
              onClick={resetFontSize}
              title="Reset font size"
            >
              {fontSize}px
            </button>

            <button
              type="button"
              onClick={increaseFontSize}
              disabled={fontSize >= 24}
              title="Increase font size"
            >
              +
            </button>
          </div>

          <button
            className="fullscreen-button"
            onClick={() => setIsFullscreen((previous) => !previous)}
          >
            {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          </button>

          <button className="reset-button" onClick={handleReset}>
            Reset Code
          </button>

          <button className="save-draft-button" onClick={handleSaveDraft}>
            Save Draft
          </button>

          <button
            className="run-button"
            onClick={handleRun}
            disabled={isRunning || isSubmitting}
          >
            {isRunning ? 'Running...' : 'Run Code'}
          </button>

          <button
            className="submit-button"
            onClick={handleSubmit}
            disabled={isRunning || isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </div>

      <Editor
        height={isFullscreen ? 'calc(100vh - 120px)' : '500px'}
        language={language}
        theme="vs-dark"
        value={code}
        onChange={(value) => {
          setCode(value || '')
          setIsSaved(false)
        }}
        options={{
          minimap: { enabled: false },
          fontSize: fontSize,
          automaticLayout: true,
          scrollBeyondLastLine: false
        }}
      />

      <div className="draft-save-info">
        <span>{isSaved ? '✓ Saved' : 'Unsaved changes'}</span>
        <span>Language: {language.toUpperCase()}</span>

        <span>
          {lastSaved
            ? `Last saved: ${lastSaved}`
            : 'Not manually saved yet'}
        </span>

        <button
          type="button"
          onClick={handleRestoreStarter}
        >
          Restore Starter Code
        </button>
      </div>
    </div>
  )
}

export default CodeEditor
