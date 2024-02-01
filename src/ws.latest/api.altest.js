// 

const f = (url) => fetch('https://api3.binance.com/api/v3/' + url).then(res => res.json())

export const getTickerPrice = (pairs = []) => f(`ticker/price?symbols=[${pairs.map(([a, b]) => `"${a}${b}"`).join(',')}]`)

export const getTime = () => f('time')

export const buy = () => Promise.resolve({}) // FIXME
