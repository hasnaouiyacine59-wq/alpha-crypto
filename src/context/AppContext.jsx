import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { getTrendingCoins, getGlobalStats } from '../utils/api'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [chain, setChain] = useState('ethereum')
  const [wallet, setWallet] = useState(null)
  const [watchlist, setWatchlist] = useState(() => {
    try { return JSON.parse(localStorage.getItem('ac_watchlist') || '[]') } catch { return [] }
  })
  const [trending, setTrending] = useState([])
  const [globalStats, setGlobalStats] = useState(null)
  const [theme] = useState('dark')

  useEffect(() => {
    getTrendingCoins().then(setTrending).catch(() => {})
    getGlobalStats().then(setGlobalStats).catch(() => {})
  }, [])

  useEffect(() => {
    localStorage.setItem('ac_watchlist', JSON.stringify(watchlist))
  }, [watchlist])

  const connectWallet = useCallback(async () => {
    if (!window.ethereum) {
      alert('Please install MetaMask or another Web3 wallet.')
      return
    }
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
      setWallet(accounts[0])
    } catch (e) {
      console.error('Wallet connect failed', e)
    }
  }, [])

  const disconnectWallet = useCallback(() => setWallet(null), [])

  const toggleWatchlist = useCallback((pair) => {
    setWatchlist(prev => {
      const exists = prev.find(p => p.pairAddress === pair.pairAddress)
      return exists ? prev.filter(p => p.pairAddress !== pair.pairAddress) : [...prev, pair]
    })
  }, [])

  const isWatchlisted = useCallback((pairAddress) =>
    watchlist.some(p => p.pairAddress === pairAddress), [watchlist])

  return (
    <AppContext.Provider value={{
      chain, setChain,
      wallet, connectWallet, disconnectWallet,
      watchlist, toggleWatchlist, isWatchlisted,
      trending, globalStats, theme
    }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)
