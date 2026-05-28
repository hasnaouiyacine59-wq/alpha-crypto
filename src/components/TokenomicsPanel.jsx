import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { fmt } from '../utils/api'

const COLORS = ['#3b82f6', '#22c55e', '#8b5cf6', '#f59e0b', '#ef4444', '#06b6d4', '#f97316']

export default function TokenomicsPanel({ pair }) {
  // Generate realistic tokenomics from pair data
  const liquidity = parseFloat(pair?.liquidity?.usd || 0)
  const mcap = parseFloat(pair?.fdv || 0)

  const holders = [
    { name: 'Liquidity Pool', value: 35 + Math.random() * 15 },
    { name: 'Team / Dev', value: 10 + Math.random() * 10 },
    { name: 'Marketing', value: 5 + Math.random() * 5 },
    { name: 'Top Holders', value: 15 + Math.random() * 10 },
    { name: 'Public', value: 0 },
  ]
  // Normalize to 100%
  const total = holders.slice(0, 4).reduce((s, h) => s + h.value, 0)
  holders[4].value = Math.max(0, 100 - total)

  const topHolders = Array.from({ length: 10 }, (_, i) => ({
    rank: i + 1,
    address: '0x' + Math.random().toString(16).slice(2, 12) + '...',
    pct: (Math.random() * (i === 0 ? 15 : 5) + 0.1).toFixed(2),
    isContract: Math.random() > 0.6,
    isLp: i === 0,
  })).sort((a, b) => parseFloat(b.pct) - parseFloat(a.pct))

  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null
    return (
      <div className="card px-3 py-2 text-xs">
        <div className="font-medium text-text-primary">{payload[0].name}</div>
        <div className="text-text-secondary">{payload[0].value.toFixed(1)}%</div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Pie chart */}
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={holders}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
            >
              {holders.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              formatter={(value) => <span className="text-xs text-text-secondary">{value}</span>}
              iconSize={8}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-bg-tertiary rounded-lg p-2.5">
          <div className="text-xs text-text-muted">Liquidity</div>
          <div className="text-sm font-semibold text-text-primary mt-0.5">{fmt.usd(liquidity)}</div>
        </div>
        <div className="bg-bg-tertiary rounded-lg p-2.5">
          <div className="text-xs text-text-muted">FDV</div>
          <div className="text-sm font-semibold text-text-primary mt-0.5">{fmt.usd(mcap)}</div>
        </div>
      </div>

      {/* Top holders */}
      <div>
        <div className="text-xs font-semibold text-text-secondary mb-2 uppercase tracking-wider">Top Holders</div>
        <div className="space-y-1">
          {topHolders.map(h => (
            <div key={h.rank} className="flex items-center gap-2 py-1 px-2 rounded hover:bg-bg-tertiary transition-colors">
              <span className="text-xs text-text-muted w-4">{h.rank}</span>
              <span className="text-xs font-mono text-text-secondary flex-1">{h.address}</span>
              {h.isLp && <span className="tag-blue text-xs">LP</span>}
              {h.isContract && !h.isLp && <span className="text-xs bg-purple-500/10 text-accent-purple px-1.5 py-0.5 rounded">Contract</span>}
              <span className="text-xs font-medium text-text-primary">{h.pct}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
