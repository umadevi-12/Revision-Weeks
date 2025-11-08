
import React, { useState } from 'react'
import Quiz from './Quiz'
import { QUESTIONS } from './data'

export default function App() {
  const [phase, setPhase] = useState('start') 
  const [final, setFinal] = useState(null)


  function handleFinish({ score, history, stats }) {
 
    let longest = { time: 0, index: -1 }
    history.forEach((h, i) => {
      if (h.timeTaken > longest.time) {
        longest.time = h.timeTaken
        longest.index = i
      }
    })


    setFinal({ score, history, stats, longest })
    setPhase('summary')
  }


  function restart() {
    setPhase('quiz')
    setFinal(null)
  }

  return (
    <div className="app-root">
      <header>
        <h1>Interactive Quiz</h1>
      </header>


      {phase === 'start' && (
        <div className="center">
          <p>Welcome! The quiz has {QUESTIONS.length} questions. You have 15 seconds per question.</p>
          <button onClick={() => setPhase('quiz')}>Start Quiz</button>
        </div>
      )}


      {phase === 'quiz' && (
        <Quiz onFinish={handleFinish} />
      )}


      {phase === 'summary' && final && (
        <div className="summary">
          <h2>Quiz Summary</h2>
          <div className="summary-stats">
            <div>Total score: {final.score}</div>
            <div>Correct: {final.stats.correct}</div>
            <div>Wrong: {final.stats.wrong}</div>
            <div>Skipped: {final.stats.skipped}</div>
            <div>Longest time on single question: {final.longest.time}s</div>
          </div>


          <h3>History (longest highlighted)</h3>
          <ol>
            {final.history.map((h, i) => (
              <li key={i} className={i === final.longest.index ? 'highlight' : ''}>
                <div><strong>{h.question}</strong></div>
                <div>Selected: {h.selectedIndex === null || h.selectedIndex === undefined ? '—' : `${String.fromCharCode(65 + h.selectedIndex)}. ${h.options[h.selectedIndex]}`}</div>
                <div>Status: {h.status}</div>
                <div>Time: {h.timeTaken}s</div>
              </li>
            ))}
          </ol>


          <div className="summary-controls">
            <button onClick={() => { setPhase('quiz'); setFinal(null); }}>Restart Quiz</button>
            <button onClick={() => { setPhase('start'); setFinal(null); }}>Back to Start</button>
          </div>
        </div>
      )}


      <footer>
        <small>Built with React — Quiz demo</small>
      </footer>
    </div>
  )
}