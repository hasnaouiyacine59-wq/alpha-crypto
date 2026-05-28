import { useState, useEffect } from 'react'
import { searchPairs } from '../utils/api'

export function useSearch(query, delay = 400) {
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!query || query.length < 2) { setResults([]); return }
    const t = setTimeout(async () => {
      setLoading(true)
      try {
        const pairs = await searchPairs(query)
        setResults(pairs.slice(0, 20))
      } catch { setResults([]) }
      finally { setLoading(false) }
    }, delay)
    return () => clearTimeout(t)
  }, [query, delay])

  return { results, loading }
}
