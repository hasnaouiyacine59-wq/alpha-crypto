import axios from 'axios'
import { DEXSCREENER_API, COINGECKO_API } from './chains'

// DexScreener API - free, no key needed
export const searchPairs = async (query) => {
  const { data } = await axios.get(`${DEXSCREENER_API}/search?q=${query}`)
  return data.pairs || []
}

export const getPairByAddress = async (chainId, pairAddress) => {
  const { data } = await axios.get(`${DEXSCREENER_API}/pairs/${chainId}/${pairAddress}`)
  return data.pair || null
}

export const getTokenPairs = async (tokenAddress) => {
  const { data } = await axios.get(`${DEXSCREENER_API}/tokens/${tokenAddress}`)
  return data.pairs || []
}

export const getNewPairs = async () => {
  // DexScreener latest pairs
  const { data } = await axios.get(`https://api.dexscreener.com/token-profiles/latest/v1`)
  return data || []
}

// CoinGecko - trending
export const getTrendingCoins = async () => {
  const { data } = await axios.get(`${COINGECKO_API}/search/trending`)
  return data.coins || []
}

export const getGlobalStats = async () => {
  const { data } = await axios.get(`${COINGECKO_API}/global`)
  return data.data || {}
}

export const getCoinPrice = async (ids) => {
  const { data } = await axios.get(
    `${COINGECKO_API}/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true&include_market_cap=true`
  )
  return data
}

// Format helpers
export const fmt = {
  price: (n) => {
    if (!n) return '$0'
    if (n < 0.000001) return `$${n.toExponential(2)}`
    if (n < 0.01) return `$${n.toFixed(6)}`
    if (n < 1) return `$${n.toFixed(4)}`
    if (n < 1000) return `$${n.toFixed(2)}`
    return `$${n.toLocaleString('en-US', { maximumFractionDigits: 2 })}`
  },
  usd: (n) => {
    if (!n) return '$0'
    if (n >= 1e9) return `$${(n / 1e9).toFixed(2)}B`
    if (n >= 1e6) return `$${(n / 1e6).toFixed(2)}M`
    if (n >= 1e3) return `$${(n / 1e3).toFixed(2)}K`
    return `$${n.toFixed(2)}`
  },
  pct: (n) => {
    if (!n) return '0.00%'
    const sign = n >= 0 ? '+' : ''
    return `${sign}${n.toFixed(2)}%`
  },
  addr: (addr) => addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : '',
  num: (n) => {
    if (!n) return '0'
    if (n >= 1e9) return `${(n / 1e9).toFixed(2)}B`
    if (n >= 1e6) return `${(n / 1e6).toFixed(2)}M`
    if (n >= 1e3) return `${(n / 1e3).toFixed(2)}K`
    return n.toLocaleString()
  },
  time: (ts) => {
    const d = new Date(ts * 1000)
    return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  },
  timeAgo: (ts) => {
    const sec = Math.floor(Date.now() / 1000 - ts)
    if (sec < 60) return `${sec}s ago`
    if (sec < 3600) return `${Math.floor(sec / 60)}m ago`
    if (sec < 86400) return `${Math.floor(sec / 3600)}h ago`
    return `${Math.floor(sec / 86400)}d ago`
  }
}
