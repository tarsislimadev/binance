import { Database } from '@brtmvdl/database'

const db = new Database({ config: '/data', type: 'fs' })

export const savePrice = (symbol, price, datetime) => Promise.resolve(
  db.in('price').new().writeMany({ symbol, price, datetime })
)

export const savePairsPrices = (prices = [], datetime = Date.now()) => Promise.all(
  prices.map(({ symbol, price } = {}) => savePrice(symbol, price, datetime))
)

export const getAllPrices = () => Promise.resolve(
  db.in('price')
    .list()
    .map((buy) => buy.readManyString(['symbol', 'price', 'datetime']))
    .map(([symbol, price, datetime]) => ({ symbol, price, datetime }))
)

export const saveBuy = (symbol, price, amount = 1, datetime = Date.now()) => Promise.resolve(
  db.in('buy')
    .new()
    .writeMany({ symbol, price, amount, datetime })
)

export const getAllBuys = () => Promise.resolve(
  db.in('buy')
    .list()
    .map((buy) => buy.readManyString(['symbol', 'price', 'amount', 'datetime', 'sell_price', 'sell_amount', 'sell_datetime']))
    .map(([symbol, price, amount, datetime, sell_price, sell_amount, sell_datetime]) => ({ symbol, price, amount, datetime, sell_price, sell_amount, sell_datetime }))
)

export const saveSell = (datetime, sell_price, sell_amount = 1, sell_datetime = Date.now()) => Promise.resolve(
  db.in('buy')
    .find({ datetime })
    .writeMany({ sell_price, sell_amount, sell_datetime })
)
