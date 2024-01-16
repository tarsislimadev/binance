// 

const getBinanceApiURL = (path) => ('https://api3.binance.com/api/v3/' + path)

export const fetchJSON = (url) => fetch(url).then(res => res.json())

export const getTickerPrice = (symbol = '') => fetchJSON(getBinanceApiURL('ticker/price?symbol=' + symbol))
