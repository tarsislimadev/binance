// 

export const PORT = 80

export const DATETIME_X = 10_000

export const DATETIME_Y = 5_000

export const CLOCK = {
  HOURS: 60 * 60,
  MINUTES: 60,
  SECONDS: 1,
}

export const PAIRS = [
  ['BTC', 'BRL'],
  ['USDT', 'BRL'],
  ['ETH', 'BRL'],
  ['XRP', 'BRL'],
  ['BNB', 'BRL'],
  ['MATIC', 'BRL'],
  ['SOL', 'BRL'],
  ['LINK', 'BRL'],
  ['LTC', 'BRL'],
  ['AVAX', 'BRL'],
  ['DOGE', 'BRL'],
  ['ADA', 'BRL'],
  ['DOT', 'BRL'],
  ['BUSD', 'BRL'],
  ['CHZ', 'BRL'],
]

export const getPairs = () => Array.from(PAIRS.map(([a, b]) => a + b))
