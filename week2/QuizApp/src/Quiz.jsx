import React, { useEffect, useState, useRef } from 'react'
import { QUESTIONS } from './data'


export default function Quiz({ onFinish }) {
    const TOTAL = QUESTIONS.length
    const QUESTION_TIME = 15 // seconds per question


    const [index, setIndex] = useState(0)
    const [timeLeft, setTimeLeft] = useState(QUESTION_TIME)
    const [isAnswered, setIsAnswered] = useState(false)
    const [selected, setSelected] = useState(null)
    const [score, setScore] = useState(0)
    const [history, setHistory] = useState([])
    const [stats, setStats] = useState({ correct: 0, wrong: 0, skipped: 0 })


    const startTimestampRef = useRef(Date.now())
    const timerRef = useRef(null)


    useEffect(() => {
        // start/reset timer when question changes
        setTimeLeft(QUESTION_TIME)
        setIsAnswered(false)
        setSelected(null)
        startTimestampRef.current = Date.now()


        timerRef.current = setInterval(() => {
            setTimeLeft((t) => t - 1)
        }, 1000)


        return () => clearInterval(timerRef.current)
    }, [index])


    useEffect(() => {
        if (timeLeft <= 0 && !isAnswered) {
            // timed out -> mark as wrong (per spec)
            handleTimeout()
        }
    }, [timeLeft, isAnswered])


    function recordHistory(status, selectedIdx, timeTaken) {
        setHistory((h) => [
            ...h,
            {
                qId: QUESTIONS[index].id,
                question: QUESTIONS[index].q,
                options: QUESTIONS[index].options,
                selectedIndex: selectedIdx,
                correctIndex: QUESTIONS[index].correctIndex,
                status, // 'correct' | 'wrong' | 'skipped' | 'timeout'
                timeTaken,
            },
        ])
    }


    function handleSelect(optionIdx) {
        if (isAnswered) return
        clearInterval(timerRef.current)
    }
}