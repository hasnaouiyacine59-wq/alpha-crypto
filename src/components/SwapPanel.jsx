import { useState } from 'react'
import { fmt } from '../utils/api'
import clsx from 'clsx'

// Swap widget panel
export default function SwapPanel({ pair }) {
  const [fromAmt, setFromAmt] = useState('')
  const [slippage, setSlippage] = useState('0.5')
  const [showSettings, setShowSettings] = useState(false)

  const base = pair?.baseToken
  const quote = pair?.quoteToken
  const price = parseFloat(pair?.priceUsd || 0)
  const priceNative = parseFloat(pair?.priceNative || 0)

  const toAmt = fromAmt && priceNative ? (parseFloat(fromAmt) / priceNative).toFixed(6) : ''
  const usdValue = fromAmt ? fmt.usd(parseFloat(fromAmt) * (price / priceNative || 1)) : ''

  return (
    <div className="p-4 space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-text-primary">Swap</span>
        <button onClick={() => setShowSettings(!showSettings)} className="p-1.5 rounded-lg hover:bg-bg-hover text-text-muted hover:text-text-primary transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      </div>

      {/* Slippage settings */}
      {showSettings && (
        <div className="bg-bg-tertiary rounded-xl p-3 space-y-2 animate-slide-in">
          <div className="text-xs text-text-muted">Slippage Tolerance</div>
          <div className="flex gap-2">
            {['0.1', '0.5', '1.0', '3.0'].map(s => (
              <button
                key={s}
                onClick={() => setSlippage(s)}
                className={clsx(
                  'flex-1 py-1 rounded text-xs font-medium transition-colors',
                  slippage === s ? 'bg-accent-blue text-white' : 'bg-bg-card text-text-secondary hover:text-text-primary'
                )}
              >
                {s}%
              </button>
            ))}
          </div>
        </div>
      )}

      {/* From */}
      <div className="bg-bg-tertiary rounded-xl p-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-text-muted">From</span>
          <span className="text-xs text-text-muted">Balance: —</span>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="0.0"
            value={fromAmt}
            onChange={e => setFromAmt(e.target.value)}
            className="flex-1 bg-transparent text-xl font-semibold text-text-primary outline-none placeholder-text-muted"
          />
          <div className="flex items-center gap-1.5 bg-bg-card rounded-lg px-2.5 py-1.5 shrink-0">
            <div className="w-5 h-5 rounded-full bg-accent-yellow/20 flex items-center justify-center text-xs">⬡</div>
            <span className="text-sm font-medium text-text-primary">{quote?.symbol || 'ETH'}</span>
          </div>
        </div>
        {usdValue && <div className="text-xs text-text-muted mt-1">{usdValue}</div>}
      </div>

      {/* Swap arrow */}
      <div className="flex justify-center">
        <div className="w-8 h-8 rounded-full bg-bg-tertiary border border-border flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-bg-hover cursor-pointer transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
          </svg>
        </div>
      </div>

      {/* To */}
      <div className="bg-bg-tertiary rounded-xl p-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-text-muted">To</span>
          <span className="text-xs text-text-muted">Balance: —</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex-1 text-xl font-semibold text-text-primary">
            {toAmt || <span className="text-text-muted">0.0</span>}
          </div>
          <div className="flex items-center gap-1.5 bg-bg-card rounded-lg px-2.5 py-1.5 shrink-0">
            <div className="w-5 h-5 rounded-full bg-accent-blue/20 flex items-center justify-center text-xs font-bold text-accent-blue">
              {base?.symbol?.slice(0, 1)}
            </div>
            <span className="text-sm font-medium text-text-primary">{base?.symbol || 'TOKEN'}</span>
          </div>
        </div>
      </div>

      {/* Price info */}
      {price > 0 && (
        <div className="text-xs text-text-muted flex justify-between px-1">
          <span>1 {quote?.symbol} = {(1 / priceNative).toFixed(4)} {base?.symbol}</span>
          <span>Slippage: {slippage}%</span>
        </div>
      )}

      {/* Swap button */}
      <button className="w-full py-3 rounded-xl bg-accent-blue hover:bg-blue-600 text-white font-semibold text-sm transition-colors">
        Connect Wallet to Swap
      </button>

      <div className="text-xs text-text-muted text-center">
        Powered by Uniswap · 0.3% fee
      </div>
    </div>
  )
}
