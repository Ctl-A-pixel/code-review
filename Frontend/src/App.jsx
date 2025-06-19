import { useState, useEffect } from 'react'
import "prismjs/themes/prism-tomorrow.css"
import Editor from "react-simple-code-editor"
import prism from "prismjs"
import axios from 'axios'
import './App.css'

function App() {
  const [code, setCode] = useState(`function sum(a, b) {
  return a + b;
}

console.log(sum(5, 3));`)
  const [review, setReview] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    prism.highlightAll()
  }, [])

  async function reviewCode() {
    if (!code.trim()) {
      setError('Please enter some code to review')
      return
    }

    setIsLoading(true)
    setError('')
    setReview('')

    try {
      const response = await axios.post('http://localhost:3000/ai/get-review', { 
        code,
        language: 'javascript'
      })
      setReview(response.data)
    } catch (err) {
      setError(err.response?.data || 'Failed to review code. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="main-bg">
      {/* Header */}
      <div className="header-bar">
        <div className="header-content">
          <h1 className="header-title">🚀 Code Review AI</h1>
          <p className="header-desc">Get instant AI-powered code reviews and suggestions</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Left Panel - Code Editor */}
        <div className="panel card">
          <div className="panel-header">
            <h3>📝 Code Editor</h3>
            <p>Write or paste your code here</p>
          </div>
          <div className="panel-body code-scroll">
            <Editor
              value={code}
              onValueChange={setCode}
              highlight={code => prism.highlight(code, prism.languages.javascript, "javascript")}
              padding={20}
              style={{
                fontFamily: '"JetBrains Mono", "Fira Code", "Fira Mono", monospace',
                fontSize: 14,
                minHeight: 380,
                maxHeight: 380,
                height: 380,
                width: "100%",
                backgroundColor: '#0f172a',
                color: '#e2e8f0',
                overflow: 'auto'
              }}
            />
          </div>
          <div className="panel-footer">
            <button 
              onClick={reviewCode}
              disabled={isLoading}
              className="review-btn"
            >
              {isLoading ? '🔄 Analyzing Code...' : '🔍 Review Code'}
            </button>
          </div>
        </div>

        {/* Right Panel - Review Results */}
        <div className="panel card">
          <div className="panel-header">
            <h3>🤖 AI Review Results</h3>
            <p>Get detailed feedback and suggestions</p>
          </div>
          <div className="panel-body output-scroll">
            {error && (
              <div className="error-box">
                <div className="error-title">❌ Error</div>
                <p>{error}</p>
              </div>
            )}
            {isLoading && (
              <div className="loading-box">
                <div className="loading-icon">🔄</div>
                <h4>Analyzing Your Code</h4>
                <p>Our AI is reviewing your code for best practices, performance, and security...</p>
              </div>
            )}
            {review && !isLoading && !error && (
              <div className="review-box">
                <div className="review-title">✨ Review Complete</div>
                <pre className="review-content">{review}</pre>
              </div>
            )}
            {!review && !isLoading && !error && (
              <div className="empty-box">
                <div className="empty-icon">💡</div>
                <h4>Ready for Review</h4>
                <p>Write some code and click "Review Code" to get started</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
