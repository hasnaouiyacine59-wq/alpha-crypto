import { useEffect, useRef } from 'react'

// Lightweight Charts candlestick chart
export default function PriceChart({ pairAddress, chainId, symbol }) {
  const containerRef = useRef(null)
  const chartRef = useRef(null)
  const seriesRef = useRef(null)

  useEffect(() => {
    let chart
    let interval

    const init = async () => {
      const { createChart, ColorType, CrosshairMode } = await import('lightweight-charts')
      if (!containerRef.current) return

      chart = createChart(containerRef.current, {
        layout: {
          background: { type: ColorType.Solid, color: '#1e2130' },
          textColor: '#94a3b8',
        },
        grid: {
          vertLines: { color: '#2a2d3e' },
          horzLines: { color: '#2a2d3e' },
        },
        crosshair: { mode: CrosshairMode.Normal },
        rightPriceScale: { borderColor: '#2a2d3e' },
        timeScale: { borderColor: '#2a2d3e', timeVisible: true, secondsVisible: false },
        width: containerRef.current.clientWidth,
        height: 380,
      })

      chartRef.current = chart

      const candleSeries = chart.addCandlestickSeries({
        upColor: '#22c55e',
        downColor: '#ef4444',
        borderUpColor: '#22c55e',
        borderDownColor: '#ef4444',
        wickUpColor: '#22c55e',
        wickDownColor: '#ef4444',
      })
      seriesRef.current = candleSeries

      // Generate realistic mock OHLCV data
      const now = Math.floor(Date.now() / 1000)
      const candles = generateCandles(now, 200)
      candleSeries.setData(candles)
      chart.timeScale().fitContent()

      // Simulate live updates
      interval = setInterval(() => {
        const last = candles[candles.length - 1]
        const newClose = last.close * (1 + (Math.random() - 0.5) * 0.002)
        const update = {
          time: Math.floor(Date.now() / 1000),
          open: last.close,
          high: Math.max(last.close, newClose) * (1 + Math.random() * 0.001),
          low: Math.min(last.close, newClose) * (1 - Math.random() * 0.001),
          close: newClose,
        }
        candleSeries.update(update)
        candles.push(update)
      }, 3000)

      const ro = new ResizeObserver(() => {
        if (containerRef.current) chart.applyOptions({ width: containerRef.current.clientWidth })
      })
      ro.observe(containerRef.current)
    }

    init()
    return () => {
      clearInterval(interval)
      if (chartRef.current) { chartRef.current.remove(); chartRef.current = null }
    }
  }, [pairAddress, chainId])

  return (
    <div ref={containerRef} className="w-full rounded-b-xl overflow-hidden" style={{ minHeight: 380 }} />
  )
}

function generateCandles(endTime, count) {
  const candles = []
  let price = 0.0001 + Math.random() * 0.01
  const interval = 300 // 5 min

  for (let i = count; i >= 0; i--) {
    const time = endTime - i * interval
    const change = (Math.random() - 0.48) * 0.03
    const open = price
    const close = price * (1 + change)
    const high = Math.max(open, close) * (1 + Math.random() * 0.01)
    const low = Math.min(open, close) * (1 - Math.random() * 0.01)
    candles.push({ time, open, high, low, close })
    price = close
  }
  return candles
}
