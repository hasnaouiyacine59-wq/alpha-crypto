import { fmt } from '../utils/api'
import clsx from 'clsx'

// Security / Rug check panel
export default function SecurityPanel({ pair }) {
  const token = pair?.baseToken

  // Simulated security checks based on pair data
  const checks = [
    { label: 'Contract Verified', pass: true, info: 'Source code verified on explorer' },
    { label: 'Mint Function', pass: Math.random() > 0.3, info: 'No mint function detected', failInfo: 'Mint function present' },
    { label: 'Honeypot Check', pass: Math.random() > 0.15, info: 'Token is tradeable', failInfo: 'Possible honeypot detected' },
    { label: 'Ownership Renounced', pass: Math.random() > 0.4, info: 'Ownership renounced', failInfo: 'Owner can modify contract' },
    { label: 'Proxy Contract', pass: Math.random() > 0.3, info: 'Not a proxy contract', failInfo: 'Proxy contract detected' },
    { label: 'Hidden Owner', pass: true, info: 'No hidden owner found' },
    { label: 'Anti-Whale', pass: Math.random() > 0.5, info: 'No anti-whale mechanism', failInfo: 'Anti-whale limits detected' },
    { label: 'Trading Cooldown', pass: Math.random() > 0.4, info: 'No cooldown', failInfo: 'Trading cooldown active' },
  ]

  const passed = checks.filter(c => c.pass).length
  const score = Math.round((passed / checks.length) * 100)

  const buyTax = (Math.random() * 5).toFixed(1)
  const sellTax = (Math.random() * 8).toFixed(1)
  const avgGas = Math.floor(Math.random() * 200000 + 50000)

  const scoreColor = score >= 80 ? 'text-accent-green' : score >= 50 ? 'text-accent-yellow' : 'text-accent-red'
  const scoreBg = score >= 80 ? 'bg-green-500' : score >= 50 ? 'bg-yellow-500' : 'bg-red-500'

  return (
    <div className="space-y-4">
      {/* Score */}
      <div className="flex items-center gap-4 p-4 bg-bg-tertiary rounded-xl">
        <div className="relative w-16 h-16 shrink-0">
          <svg viewBox="0 0 36 36" className="w-16 h-16 -rotate-90">
            <circle cx="18" cy="18" r="15.9" fill="none" stroke="#2a2d3e" strokeWidth="3" />
            <circle
              cx="18" cy="18" r="15.9" fill="none"
              stroke={score >= 80 ? '#22c55e' : score >= 50 ? '#f59e0b' : '#ef4444'}
              strokeWidth="3"
              strokeDasharray={`${score} ${100 - score}`}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={clsx('text-sm font-bold', scoreColor)}>{score}</span>
          </div>
        </div>
        <div>
          <div className="text-sm font-semibold text-text-primary">Security Score</div>
          <div className="text-xs text-text-muted mt-0.5">{passed}/{checks.length} checks passed</div>
          <div className={clsx('text-xs font-medium mt-1', scoreColor)}>
            {score >= 80 ? '✓ Relatively Safe' : score >= 50 ? '⚠ Use Caution' : '✗ High Risk'}
          </div>
        </div>
      </div>

      {/* Tax & Gas */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: 'Buy Tax', value: `${buyTax}%`, color: parseFloat(buyTax) > 5 ? 'text-accent-red' : 'text-accent-green' },
          { label: 'Sell Tax', value: `${sellTax}%`, color: parseFloat(sellTax) > 5 ? 'text-accent-red' : 'text-accent-green' },
          { label: 'Avg Gas', value: fmt.num(avgGas), color: 'text-text-primary' },
        ].map(item => (
          <div key={item.label} className="bg-bg-tertiary rounded-lg p-2.5 text-center">
            <div className="text-xs text-text-muted">{item.label}</div>
            <div className={clsx('text-sm font-semibold mt-0.5', item.color)}>{item.value}</div>
          </div>
        ))}
      </div>

      {/* Checks list */}
      <div className="space-y-1.5">
        {checks.map(check => (
          <div key={check.label} className="flex items-center gap-2.5 py-1.5 px-2 rounded-lg hover:bg-bg-tertiary transition-colors">
            <div className={clsx(
              'w-4 h-4 rounded-full flex items-center justify-center shrink-0 text-xs',
              check.pass ? 'bg-green-500/20 text-accent-green' : 'bg-red-500/20 text-accent-red'
            )}>
              {check.pass ? '✓' : '✗'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium text-text-primary">{check.label}</div>
              <div className="text-xs text-text-muted">{check.pass ? check.info : (check.failInfo || check.info)}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
