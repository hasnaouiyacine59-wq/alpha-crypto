import { useState, useEffect } from 'react'
import { useApp } from '../context/AppContext'
import { fmt } from '../utils/api'
import clsx from 'clsx'

// Mock portfolio holdings generator
function generateHoldings(wallet) {
  const tokens = [
    { symbol: 'ETH', name: 'Ethereum', price: 3200, amount: 1.45, change: 2.3 },
    { symbol: 'PEPE', name: 'Pepe', price: 0.0000123, amount: 45000000, change: -5.2 },
    { symbol: 'LINK', name: 'Chainlink', price: 14.5, amount: 120, change: 1.8 },
    { symbol: 'UNI', name: 'Uniswap', price: 8.2, amount: 85, change: -0.9 },
    { symbol: 'ARB', name: 'Arbitrum', price: 1.12, amount: 500, change: 3.1 },
  ]
  return tokens.map(t => ({
    ...t,
    value: t.price * t.amount,
    pnl: (Math.random() - 0.4) * t.price * t.amount * 0.3,
  }))
}

export default function PortfolioPage() {
  const { wallet, connectWallet } = useApp()
  const [holdings, setHoldings] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!wallet) return
    setLoading(true)
    setTimeout(() => {
      setHoldings(generateHoldings(wallet))
      setLoading(false)
    }, 1000)
  }, [wallet])

  const totalValue = holdings.reduce((s, h) => s + h.value, 0)
  const totalPnl = holdings.reduce((s, h) => s + h.pnl, 0)
  const pnlPct = totalValue > 0 ? (totalPnl / (totalValue - totalPnl)) * 100 : 0

  if (!wallet) return (
    <div className="flex flex-col items-center justify-center h-96 gap-4">
      <div className="text-5xl">💼</div>
      <div className="text-lg font-semibold text-text-primary">Connect your wallet</div>
      <div className="text-sm text-text-muted">Connect your Web3 wallet to view your portfolio holdings.</div>
      <button onClick={connectWallet} className="btn-primary flex items-center gap-2">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
        Connect Wallet
      </button>
    </div>
  )

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <span className="text-2xl">💼</span>
        <div>
          <h1 className="text-xl font-bold text-text-primary">Portfolio</h1>
          <p className="text-sm text-text-muted font-mono">{wallet}</p>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card p-5">
          <div className="text-xs text-text-muted mb-1">Total Value</div>
          <div className="text-2xl font-bold text-text-primary">{fmt.usd(totalValue)}</div>
        </div>
        <div className="card p-5">
          <div className="text-xs text-text-muted mb-1">Total PnL</div>
          <div className={clsx('text-2xl font-bold', totalPnl >= 0 ? 'text-accent-green' : 'text-accent-red')}>
            {totalPnl >= 0 ? '+' : ''}{fmt.usd(totalPnl)}
          </div>
        </div>
        <div className="card p-5">
          <div className="text-xs text-text-muted mb-1">PnL %</div>
          <div className={clsx('text-2xl font-bold', pnlPct >= 0 ? 'text-accent-green' : 'text-accent-red')}>
            {fmt.pct(pnlPct)}
          </div>
        </div>
      </div>

      {/* Holdings table */}
      {loading ? (
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => <div key={i} className="skeleton h-14 rounded-xl" />)}
        </div>
      ) : (
        <div className="card overflow-hidden">
          <table className="data-table">
            <thead>
              <tr>
                <th>Token</th>
                <th className="text-right">Price</th>
                <th className="text-right">24h</th>
                <th className="text-right">Balance</th>
                <th className="text-right">Value</th>
                <th className="text-right">PnL</th>
                <th className="text-right">Allocation</th>
              </tr>
            </thead>
            <tbody>
              {holdings.map(h => (
                <tr key={h.symbol}>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-blue/20 to-accent-purple/20 flex items-center justify-center text-xs font-bold text-accent-blue">
                        {h.symbol.slice(0, 2)}
                      </div>
                      <div>
                        <div className="font-medium text-sm text-text-primary">{h.symbol}</div>
                        <div className="text-xs text-text-muted">{h.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="text-right font-mono text-sm text-text-primary">{fmt.price(h.price)}</td>
                  <td className={clsx('text-right font-mono text-xs', h.change >= 0 ? 'text-accent-green' : 'text-accent-red')}>
                    {fmt.pct(h.change)}
                  </td>
                  <td className="text-right font-mono text-sm text-text-secondary">{fmt.num(h.amount)}</td>
                  <td className="text-right font-mono text-sm text-text-primary font-medium">{fmt.usd(h.value)}</td>
                  <td className={clsx('text-right font-mono text-sm', h.pnl >= 0 ? 'text-accent-green' : 'text-accent-red')}>
                    {h.pnl >= 0 ? '+' : ''}{fmt.usd(h.pnl)}
                  </td>
                  <td className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <div className="w-16 h-1.5 bg-bg-tertiary rounded-full overflow-hidden">
                        <div
                          className="h-full bg-accent-blue rounded-full"
                          style={{ width: `${Math.min(100, (h.value / totalValue) * 100)}%` }}
                        />
                      </div>
                      <span className="text-xs text-text-muted w-10 text-right">
                        {((h.value / totalValue) * 100).toFixed(1)}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
