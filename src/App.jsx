import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AppProvider } from './context/AppContext'
import Navbar from './components/Navbar'
import TrendingBar from './components/TrendingBar'
import HomePage from './pages/HomePage'
import PairPage from './pages/PairPage'
import TrendingPage from './pages/TrendingPage'
import NewPairsPage from './pages/NewPairsPage'
import WatchlistPage from './pages/WatchlistPage'
import PortfolioPage from './pages/PortfolioPage'

export default function App() {
  return (
    <AppProvider>
      <div className="min-h-screen bg-bg-primary flex flex-col">
        <Navbar />
        <TrendingBar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/pair/:chainId/:pairAddress" element={<PairPage />} />
            <Route path="/trending" element={<TrendingPage />} />
            <Route path="/new-pairs" element={<NewPairsPage />} />
            <Route path="/watchlist" element={<WatchlistPage />} />
            <Route path="/portfolio" element={<PortfolioPage />} />
          </Routes>
        </main>
        <footer className="border-t border-border/60 py-5 px-6 text-center text-xs text-text-muted"
          style={{ background: 'rgba(14,12,26,0.8)' }}>
          <span className="text-gradient font-semibold">AlphaCrypto</span>
          <span className="mx-2 text-border">·</span>
          Real-time DEX Analytics
          <span className="mx-2 text-border">·</span>
          Not financial advice
        </footer>
      </div>
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: { background: '#1e2130', color: '#e2e8f0', border: '1px solid #2a2d3e' },
        }}
      />
    </AppProvider>
  )
}
