import { useState, useEffect } from 'react'

export default function Typewriter({ text, speed = 45, delay = 0, className = '', onDone }) {
  const [displayed, setDisplayed] = useState('')
  const [started, setStarted] = useState(delay === 0)

  useEffect(() => {
    if (delay === 0) return
    const t = setTimeout(() => setStarted(true), delay)
    return () => clearTimeout(t)
  }, [delay])

  useEffect(() => {
    if (!started) return
    setDisplayed('')
    let i = 0
    const t = setInterval(() => {
      i++
      setDisplayed(text.slice(0, i))
      if (i >= text.length) { clearInterval(t); onDone?.() }
    }, speed)
    return () => clearInterval(t)
  }, [started, text, speed])

  return (
    <span className={className}>
      {displayed}
      {displayed.length < text.length && started && (
        <span className="inline-block w-0.5 h-[1em] bg-accent-purple ml-0.5 align-middle animate-pulse" />
      )}
    </span>
  )
}
