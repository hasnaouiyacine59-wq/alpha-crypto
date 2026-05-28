import { useState, useEffect } from 'react'
import { fmt } from '../utils/api'
import clsx from 'clsx'

// Mock transaction generator for live feel
function generateTx(basePrice) {
  const isBuy = Math.random() > 0.45
  const price = basePrice * (1 + (Math.random() - 0.5) * 0.005)
  const amount = Math.random() * 50000 + 100
  const usd = price * amount
  return {
    id: Math.random().toString(36).slice(2),
    type: isBuy ? 'buy' : 'sell',
    price,
    amount,
    usd,
    wallet: '0x' + Math.random().toString(16).slice(2, 10) + '...' + Math.random().toString(16).slice(2, 6),
    time: Math.floor(Date.now() / 1000) - Math.floor(Math.random() * 300),
    txHash: '0x' + Math.random().toString(16).slice(2, 18),
  }
}

export default function TransactionHistory({ pair }) {
  const [filter, setFilter] = useState('all') // all | buy | sell
  const [txs, setTxs] = useState([])
  const basePrice = parseFloat(pair?.priceUsd || 0.001)

  useEffect(() => {
    // Seed initial transactions
    const initial = Array.from({ length: 30 }, () => generateTx(basePrice))
      .sort((a, b) => b.time - a.time)
    setTxs(initial)

    // Live updates
    const interval = setInterval(() => {
      setTxs(prev => [generateTx(basePrice), ...prev.slice(0, 49)])
    }, 4000)
    return () => clearInterval(interval)
  }, [pair?.pairAddress])

  const filtered = filter === 'all' ? txs : txs.filter(t => t.type === filter)

  return (
    <div className="flex flex-col h-full">
      {/* Filter tabs */}
      <div className="flex items-center gap-1 p-3 border-b border-border">
        {['all', 'buy', 'sell'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={clsx(
              'px-3 py-1 rounded text-xs font-medium capitalize transition-colors',
              filter === f
                ? f === 'buy' ? 'bg-green-500/20 text-accent-green'
                  : f === 'sell' ? 'bg-red-500/20 text-accent-red'
                  : 'bg-bg-hover text-text-primary'
                : 'text-text-muted hover:text-text-secondary'
            )}
          >
            {f === 'all' ? 'All Txns' : f === 'buy' ? '🟢 Buys' : '🔴 Sells'}
          </button>
        ))}
        <span className="ml-auto text-xs text-text-muted">{filtered.length} txns</span>
      </div>

      {/* Header */}
      <div className="grid grid-cols-5 px-3 py-1.5 text-xs text-text-muted border-b border-border">
        <span>Time</span>
        <span className="text-right">Type</span>
        <span className="text-right">Price</span>
        <span className="text-right">Amount</span>
        <span className="text-right">USD</span>
      </div>

      {/* Rows */}
      <div className="flex-1 overflow-y-auto">
        {filtered.map((tx, i) => (
          <div
            key={tx.id}
            className={clsx(
              'grid grid-cols-5 px-3 py-1.5 text-xs border-b border-border/30 hover:bg-bg-tertiary/50 transition-colors',
              i === 0 && 'animate-fade-in'
            )}
          >
            <span className="text-text-muted font-mono">{fmt.timeAgo(tx.time)}</span>
            <span className={clsx('text-right font-medium', tx.type === 'buy' ? 'text-accent-green' : 'text-accent-red')}>
              {tx.type === 'buy' ? 'BUY' : 'SELL'}
            </span>
            <span className="text-right font-mono text-text-primary">{fmt.price(tx.price)}</span>
            <span className="text-right font-mono text-text-secondary">{fmt.num(tx.amount)}</span>
            <span className={clsx('text-right font-mono', tx.type === 'buy' ? 'text-accent-green' : 'text-accent-red')}>
              {fmt.usd(tx.usd)}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
