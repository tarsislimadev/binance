const config = require('./config.js')

const db = require('./database.js')

const savePrice = ({ symbol, price, datetime = Date.now() } = {}) => db.prices.new().writeMany({ symbol, price, datetime, })

const saveBuy = ({ symbol, price, amount, datetime, price_x, datetime_x, price_y, datetime_y, }) => db.buys.new().writeMany({ symbol, price, amount, datetime, price_x, datetime_x, price_y, datetime_y, })

const saveSell = ({ price, datetime, buy } = {}) => db.sells.new().writeMany({ price, datetime, buy, })

const getOldestPrice = (symbol, datetime = Date.now()) => getPrices(symbol).sort((a, b) => b.datetime - a.datetime).find(() => true) || {}

const getPrices = (symbol) => db.prices.list()
  .map((price) => price.readMany(['symbol', 'price', 'datetime']).map((str) => '' + str))
  .map(([symbol, price, datetime]) => ({ symbol, price, datetime }))
  .filter((price) => price.symbol == symbol)

const checkBuys = ({ symbol, price, datetime = Date.now() } = {}) => {
  const datetime_x = datetime - config.PRICE_INTERVAL_X
  const datetime_y = datetime - config.PRICE_INTERVAL_Y
  const { price: x } = getOldestPrice(symbol, datetime_x)
  const { price: y } = getOldestPrice(symbol, datetime_y)
  const z = price

  console.log('buy?', datetime, { x, y, z })

  if (x > y && x > z && y < z) { // it is a buy
    console.log('buy', symbol, price, config.BUY_AMOUNT, datetime)

    saveBuy(symbol, price, config.BUY_AMOUNT, datetime, x, datetime_x, y, datetime_y,)
  }

  return { symbol, price, datetime }
}

const checkSells = ({ symbol, price }, datetime = Date.now()) => {
  const buys = db.buys.list()
    .filter((buy) => buy.readString('symbol') == symbol)
    .filter((buy) => buy.readString('sell_price') == null)
    .filter((buy) => buy.readString('sell_datetime') == null)

  for (let i = 0; i < buys.length; i++) {
    const buy = buys[i]

    const [buy_price, buy_datetime] = buy.readMany(['price', 'datetime']).map((str) => '' + str)

    console.log('sell?', Date.now(), { x: price, y: buy_price })

    if (buy_price < price) { // it is a sell
      console.log('sell', { symbol, price, datetime, buy_price, buy_datetime})

      return buy.writeMany({ sell_price: price, sell_datetime: datetime })
    }
  }
}

const requestPrice = () => fetch(`https://api4.binance.com/api/v3/ticker/price?symbol=${config.SYMBOL}`)
  .then((res) => res.json())
  .then((price) => [checkSells(price), savePrice(price), checkBuys(price)])
  .then(() => requestPrice())
  .catch((err) => [console.error(err), setTimeout(requestPrice, config.ERROR_TIMEOUT)])

requestPrice()
