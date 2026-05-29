import { useRef, useState, useEffect } from 'react'

export default function AdBanner({ className = '' }) {
  const ref = useRef(null)
  const [blocked, setBlocked] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const t = setTimeout(() => {
      if (el.offsetHeight === 0 || el.offsetParent === null) setBlocked(true)
    }, 500)
    return () => clearTimeout(t)
  }, [])

  if (blocked) return null

  return (
    <div ref={ref} style={{ width: '100%', margin: 'auto', position: 'relative', zIndex: 99998 }} className={className}>
      <iframe
        data-aa="2439743"
        src="//acceptable.a-ads.com/2439743/?size=Adaptive"
        style={{ border: 0, padding: 0, width: '70%', height: 'auto', overflow: 'hidden', display: 'block', margin: 'auto' }}
        title="Advertisement"
      />
    </div>
  )
}
