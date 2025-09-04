# Stock Portfolio Tracker

A React-based stock portfolio management application built as a take-home assignment for the Junior Full Stack Developer role at 8byte.

## Project Description

This application allows users to view and manage their stock portfolio with real-time market data integration. Users can track their investments, monitor performance, and analyze portfolio composition across different sectors.

## Features

- **Portfolio Overview**: Display all stocks with purchase details, quantities, and current market prices
- **Sector-wise Grouping**: Organize stocks by sectors (Financial, Tech, Consumer, Power, etc.)
- **Real-time Data**: Integration with Yahoo Finance and Google Finance for current market prices
- **Performance Metrics**: Calculate gains/losses, portfolio weightage, and investment values
- **Responsive Design**: Clean, tabular interface for easy data visualization

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **UI Components**: TanStack Table for advanced table functionality
- **Styling**: Tailwind CSS
- **Market Data**: Yahoo Finance and Google Finance
- **Market Data Fetching**: yahoo-finance-2 for fetching Yahoo Finance data and cheerio along with axios to fetch Google Finance data.

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.
