
import { useEffect, useState } from 'react'
import Editor from '@monaco-editor/react'
import './CodeEditor.css'

const starterCodes = {
  python: `def solution():
    pass


if __name__ == "__main__":
    solution()`,

  javascript: `function solution() {
    
}

solution();`,

  cpp: `#include <bits/stdc++.h>
using namespace std;

int main() {
    
    return 0;
}`,

  java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        
    }
}`
}

const languages = [
  { value: 'python', label: 'Python' },
  { value: 'javascript', label: 'JavaScript' },
  { value: 'cpp', label: 'C++' },
  { value: 'java', label: 'Java' }
]

function CodeEditor({
  problemSlug,
  onRun,
  onSubmit,
  isRunning = false,
  isSubmitting = false
}) {
  const storageKey = `algopilot_code_${problemSlug || 'default'}`

  const [language, setLanguage] = useState('python')

  // Each language maintains its own code.
  const [drafts, setDrafts] = useState(starterCodes)

  const [lastSaved, setLastSaved] = useState('')
  const [isSaved, setIsSaved] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [fontSize, setFontSize] = useState(14)
  const [isLoaded, setIsLoaded] = useState(false)

  const code = drafts[language] ?? starterCodes[language]

  // Load previously saved drafts.
  useEffect(() => {
    setIsLoaded(false)

    try {
      const saved = JSON.parse(
        localStorage.getItem(storageKey) || 'null'
      )

      if (saved) {
        const savedDrafts = {
          ...starterCodes,
          ...(saved.drafts || {})
        }

        // Support drafts saved by the previous editor version.
        if (saved.code && saved.language) {
          savedDrafts[saved.language] = saved.code
        }

        setDrafts(savedDrafts)
        setLanguage(saved.language || 'python')
        setLastSaved(saved.savedAt || '')
        setIsSaved(Boolean(saved.savedAt))
      } else {
        setDrafts(starterCodes)
        setLanguage('python')
        setLastSaved('')
        setIsSaved(false)
      }
    } catch (error) {
      console.error('Unable to load saved code:', error)
      setDrafts(starterCodes)
      setLanguage('python')
      setLastSaved('')
      setIsSaved(false)
    }

    setIsLoaded(true)
  }, [storageKey])

  // Automatically save drafts for every language.
  useEffect(() => {
    if (!isLoaded) return

    try {
      localStorage.setItem(
        storageKey,
        JSON.stringify({
          drafts,
          language,
          savedAt: lastSaved
        })
      )
    } catch (error) {
      console.error('Unable to autosave code:', error)
    }
  }, [storageKey, drafts, language, lastSaved, isLoaded])

  // Close fullscreen using Escape.
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

  // Update code without affecting other languages.
  const handleCodeChange = (value) => {
    setDrafts((previous) => ({
      ...previous,
      [language]: value || ''
    }))

    setIsSaved(false)
  }

  // Change language and restore its previous draft.
  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage)
    setIsSaved(false)
  }

  // Manually save the current draft.
  const handleSaveDraft = () => {
    const savedAt = new Date().toLocaleString()

    localStorage.setItem(
      storageKey,
      JSON.stringify({
        drafts,
        language,
        savedAt
      })
    )

    setLastSaved(savedAt)
    setIsSaved(true)
  }

  // Reset current language code.
  const handleReset = () => {
    setDrafts((previous) => ({
      ...previous,
      [language]: starterCodes[language]
    }))

    setIsSaved(false)
  }

  // Restore the original starter template.
  const handleRestoreStarter = () => {
    setDrafts((previous) => ({
      ...previous,
      [language]: starterCodes[language]
    }))

    setLastSaved('')
    setIsSaved(false)
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

      {/* Editor Toolbar */}
      <div className="editor-toolbar">

        <select
          value={language}
          onChange={(e) => handleLanguageChange(e.target.value)}
        >
          {languages.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>

        <div className="editor-actions">

          {/* Font Size */}
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

          {/* Fullscreen */}
          <button
            type="button"
            className="fullscreen-button"
            onClick={() => setIsFullscreen((previous) => !previous)}
          >
            {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          </button>

          {/* Reset */}
          <button
            type="button"
            className="reset-button"
            onClick={handleReset}
          >
            Reset Code
          </button>

          {/* Save */}
          <button
            type="button"
            className="save-draft-button"
            onClick={handleSaveDraft}
          >
            Save Draft
          </button>

          {/* Run */}
          <button
            type="button"
            className="run-button"
            onClick={handleRun}
            disabled={isRunning || isSubmitting}
          >
            {isRunning ? 'Running...' : 'Run Code'}
          </button>

          {/* Submit */}
          <button
            type="button"
            className="submit-button"
            onClick={handleSubmit}
            disabled={isRunning || isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>

        </div>
      </div>

      {/* Monaco Editor */}
      <Editor
        height={isFullscreen ? 'calc(100vh - 120px)' : '500px'}
        language={language}
        theme="vs-dark"
        value={code}
        onChange={handleCodeChange}
        options={{
          minimap: { enabled: false },
          fontSize,
          automaticLayout: true,
          scrollBeyondLastLine: false,
          tabSize: 4,
          wordWrap: 'on',
          padding: {
            top: 12
          },
          suggestOnTriggerCharacters: true,
          quickSuggestions: true
        }}
      />

      {/* Draft Information */}
      <div className="draft-save-info">

        <span>
          {isSaved ? '✓ Saved' : 'Unsaved changes'}
        </span>

        <span>
          Language: {language.toUpperCase()}
        </span>

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
