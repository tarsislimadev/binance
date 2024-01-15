// 

const f = (url) => fetch('https://api4.binance.com/api/v3/' + url).then(res => res.json())

export const tickerPrice = (pairs = []) => f(`ticker/price?symbols=[${pairs.map(([a, b]) => `"${a}${b}"`).join(',')}]`)

export const time = () => f('time')

export const buy = () => Promise.resolve({}) // FIXME
