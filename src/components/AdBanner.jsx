import { useEffect, useRef, useState } from 'react'

// Slot config: dimensions match standard IAB ad sizes
const SLOTS = {
  leaderboard: { w: '100%', h: 90,  label: '728×90' },
  rectangle:   { w: 300,   h: 250, label: '300×250' },
  billboard:   { w: '100%', h: 250, label: '970×250' },
}

/**
 * AdBanner — drop-in ad unit.
 *
 * To activate a real ad network:
 *   1. Add the network's global script to index.html (e.g. AdSense <script async src="...">)
 *   2. Replace the placeholder <div> below with the network's slot markup
 *      (e.g. <ins class="adsbygoogle" ...>) and call (adsbygoogle = window.adsbygoogle || []).push({})
 *      inside the useEffect.
 *
 * Props:
 *   slot      — 'leaderboard' | 'rectangle' | 'billboard'  (default: 'leaderboard')
 *   className — extra Tailwind classes
 */
export default function AdBanner({ slot = 'leaderboard', className = '' }) {
  const s = SLOTS[slot] ?? SLOTS.leaderboard
  const containerRef = useRef(null)
  const [blocked, setBlocked] = useState(false)

  useEffect(() => {
    // Detect ad-blocker: if the container is hidden or has zero size after mount, collapse it
    const el = containerRef.current
    if (!el) return
    const timer = setTimeout(() => {
      if (el.offsetHeight === 0 || el.offsetParent === null) setBlocked(true)
    }, 300)

    // ── Real ad network hook ──────────────────────────────────────────────────
    // Example for Google AdSense — uncomment and fill in your publisher/slot IDs:
    //
    // try {
    //   (window.adsbygoogle = window.adsbygoogle || []).push({})
    // } catch (e) {}
    // ─────────────────────────────────────────────────────────────────────────

    return () => clearTimeout(timer)
  }, [])

  // Collapse entirely when blocked so it doesn't leave dead whitespace
  if (blocked) return null

  return (
    <div
      ref={containerRef}
      className={`flex items-center justify-center border border-dashed border-accent-purple/20 rounded-2xl bg-bg-tertiary/40 text-text-muted text-xs font-medium select-none overflow-hidden ${className}`}
      style={{
        width: typeof s.w === 'number' ? `${s.w}px` : s.w,
        minHeight: `${s.h}px`,
      }}
      data-ad-slot={slot}
    >
      {/* ── Replace this placeholder with your real ad tag ── */}
      <div className="flex flex-col items-center gap-1 opacity-40 pointer-events-none">
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
        Advertisement · {s.label}
      </div>
      {/* ─────────────────────────────────────────────────── */}
    </div>
  )
}
