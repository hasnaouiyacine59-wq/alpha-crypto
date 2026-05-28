// Supported chains config
export const CHAINS = {
  ethereum: {
    id: 1, name: 'Ethereum', symbol: 'ETH', color: '#627EEA',
    icon: '⟠', rpc: 'https://eth.llamarpc.com',
    explorer: 'https://etherscan.io', dex: 'Uniswap'
  },
  bsc: {
    id: 56, name: 'BNB Chain', symbol: 'BNB', color: '#F3BA2F',
    icon: '⬡', rpc: 'https://bsc-dataseed.binance.org',
    explorer: 'https://bscscan.com', dex: 'PancakeSwap'
  },
  polygon: {
    id: 137, name: 'Polygon', symbol: 'MATIC', color: '#8247E5',
    icon: '⬟', rpc: 'https://polygon-rpc.com',
    explorer: 'https://polygonscan.com', dex: 'QuickSwap'
  },
  arbitrum: {
    id: 42161, name: 'Arbitrum', symbol: 'ETH', color: '#28A0F0',
    icon: '◈', rpc: 'https://arb1.arbitrum.io/rpc',
    explorer: 'https://arbiscan.io', dex: 'Camelot'
  },
  optimism: {
    id: 10, name: 'Optimism', symbol: 'ETH', color: '#FF0420',
    icon: '⊙', rpc: 'https://mainnet.optimism.io',
    explorer: 'https://optimistic.etherscan.io', dex: 'Velodrome'
  },
  avalanche: {
    id: 43114, name: 'Avalanche', symbol: 'AVAX', color: '#E84142',
    icon: '▲', rpc: 'https://api.avax.network/ext/bc/C/rpc',
    explorer: 'https://snowtrace.io', dex: 'Trader Joe'
  },
  fantom: {
    id: 250, name: 'Fantom', symbol: 'FTM', color: '#1969FF',
    icon: '◆', rpc: 'https://rpc.ftm.tools',
    explorer: 'https://ftmscan.com', dex: 'SpookySwap'
  },
  base: {
    id: 8453, name: 'Base', symbol: 'ETH', color: '#0052FF',
    icon: '⬡', rpc: 'https://mainnet.base.org',
    explorer: 'https://basescan.org', dex: 'BaseSwap'
  },
}

export const CHAIN_LIST = Object.entries(CHAINS).map(([key, val]) => ({ key, ...val }))

export const TIMEFRAMES = [
  { label: '1m', value: '1' },
  { label: '5m', value: '5' },
  { label: '15m', value: '15' },
  { label: '1H', value: '60' },
  { label: '4H', value: '240' },
  { label: '1D', value: '1D' },
  { label: '1W', value: '1W' },
]

export const COINGECKO_API = 'https://api.coingecko.com/api/v3'
export const DEXSCREENER_API = 'https://api.dexscreener.com/latest/dex'
