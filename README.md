# Alpha Crypto

Real-time DEX analytics platform — charts, token security, portfolio tracking, and swap across 8+ blockchains.

## Features

- 📈 Real-time candlestick charts (lightweight-charts)
- 🔍 Token/pair search across all chains
- 🛡️ Security analysis — honeypot, rug check, tax, contract verification
- 🥧 Tokenomics — holder distribution pie chart
- 💼 Wallet portfolio tracking
- 🔄 Built-in swap widget
- ⭐ Watchlist (persisted in localStorage)
- 🔥 Trending tokens ticker bar
- 🆕 New pairs explorer
- 🌐 Multi-chain: Ethereum, BSC, Polygon, Arbitrum, Optimism, Avalanche, Fantom, Base

## Tech Stack

- React 18 + Vite
- Tailwind CSS
- lightweight-charts (TradingView)
- Recharts (tokenomics pie)
- React Router v6
- DexScreener API (free, no key)
- CoinGecko API (free tier)
- ethers.js (wallet connect)

## Deploy on Render.com

1. Fork / clone this repo
2. Go to [render.com](https://render.com) → New → Web Service
3. Connect your GitHub repo
4. Build command: `npm install && npm run build`
5. Start command: `npm run preview`
6. Done ✅

## Local Dev (optional)

```bash
npm install
npm run dev
```
