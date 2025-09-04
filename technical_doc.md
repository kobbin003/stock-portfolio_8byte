# Technical Challenges & Solutions

## 1. Framework Selection

- Chose NextJS for its fullstack capabilities and used server actions instead of creating separate API endpoints

## 2. State Management in React Table Columns

- **Challenge**: Difficult to pass the `isLoading` flag to column accessors in @tanstack/react-table
- **Solution**: Moved column definition inside the component and memoized it with `useMemo`, making it reactive to `isLoading` state changes
- **Implementation**: Used dependency array `[isLoading]` to re-create columns only when loading state changes

## 3. Web Scraping in Production Environment

- **Challenge**: Started with Puppeteer for web scraping, which worked well in development but failed in Vercel production with timeout errors
- **Solution**: Switched to Cheerio, used along with axios, for static HTML parsing, which is more efficient and reliable for scraping static websites.

## 4. Data Source fetching Strategy

- **Libraries used**: Used yahoo-finance-2 package and axios with cheerio to fetch data from yahoo finance and google finance, respectively.
- **Implementation**: Used `Promise.all()` to fetch data from Yahoo Finance (for CMP) and Google Finance (for P/E ratio and earnings) simultaneously
- **Failure handling**: Graceful error handling with `Promise.allSettled()` for individual scraping failures

## 5. Real-time Data Updates

- **Challenge**: Providing live stock price updates without overwhelming the servers
- **Solution**: Implemented smart caching with Next.js `unstable_cache` (12-second revalidation) and client-side 15-second intervals

## 6. Type Safety & Data Modeling

- **Implementation**: Created comprehensive TypeScript interfaces (`TStock`, `TStockDisplay`, `TYahooData`, `TGoogleData`)
- **Benefit**: IntelliSense with type inference and strong typing for complex data transformations

## 7. Error Handling & User Experience

- **Approach**: Implemented custom toast notifications with react-toastify
- **Graceful Degradation**: Shows "N/A" for missing data instead of breaking the UI

## 8. Caching Strategy

- **Server-side Caching**: Leveraged Next.js caching by using `unstable_cache` with 12-second revalidation (just before 15-second client refresh)

- **Performance**: Reduced external API calls while maintaining data freshness
