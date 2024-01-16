import * as api from './api.js'

import * as constants from './constants.js'

import { db, getOldestPriceSync } from './database.js'

const makePriceDiffs = (price = {}, datetime = Date.now()) => ({
  ...price,
  datetime,
  price_x: getOldestPriceSync(price.symbol, datetime - constants.DATETIME_X),
  price_y: getOldestPriceSync(price.symbol, datetime - constants.DATETIME_Y)
})

const savePrice = ({ symbol, price, datetime, price_x, price_y } = {}) => db.in('price')
  .new()
  .writeMany({ symbol, price, datetime, price_x, price_y })

const log = (err) => console.log(err)

const error = (err) => console.error(err)

const saveBinanceApiTickerPrice = (symbol, datetime = Date.now()) => api.getTickerPrice(symbol)
  .then((price) => makePriceDiffs(price, datetime))
  .then((price) => savePrice(price, datetime))
  .then(() => log('Save Binance Api Ticker Price', datetime))
  .catch((err) => error(err))
  .finally(() => saveBinanceApiTickerPrice(symbol))

saveBinanceApiTickerPrice('BNBBRL')
