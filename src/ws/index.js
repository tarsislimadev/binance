import http from 'http'
import { Server } from 'socket.io'
import * as config from './config.js'
import * as constants from './constants.js'
import * as api from './api.js'
import * as database from './database.js'

const server = http.createServer()
const io = new Server(server, { cors: { origin: '*' } })

const pricesAndDiffs = (prices = [], datetime = Date.now()) => prices
  .map((price) => ({
    ...price,
    datetime,
    datetime_x: datetime - config.DATETIME_X,
    datetime_y: datetime - config.DATETIME_Y
  }))
  .map((price) => ({
    ...price,
    price_x: database.getOldestPriceSync(price.symbol, price.datetime_x),
    price_y: database.getOldestPriceSync(price.symbol, price.datetime_y)
  }))

io.on('connection', socket => {
  const emit = (key, value = null) => [socket.emit(key, value), console.log('emit', key, value)]

  emit('hello')

  socket.on('hello', () => console.log('client hello'))

  const priceTickers = () => api.tickerPrice(constants.PAIRS)
    .then((prices) => pricesAndDiffs(prices))
    .then((prices) => [emit('symbol price ticker', prices), database.savePairsPrices(prices)])
    .catch((err) => emit('error symbol price ticker', err))
    .finally(() => priceTickers())

  priceTickers()

  const onServerTime = () => api.time()
    .then((time) => emit('check server time', time))
    .catch((err) => emit('error check server time', err))

  socket.on('check server time', () => onServerTime())

  const onBuy = (symbol, price, amount = 1, datetime = Date.now()) => database.saveBuy(symbol, price, amount, datetime)
    .then((buy) => emit('buy', { symbol, price, amount, datetime }))
    .catch((err) => emit('buy error', err))

  socket.on('buy', ({ symbol, price, amount = 1 } = {}) => onBuy(symbol, price, amount))

  const onBuys = () => database.getAllBuys()
    .then((buys) => emit('buys', buys))
    .catch((err) => emit('error buys', err))

  socket.on('buys', () => onBuys())

  const onSell = (datetime, price, amount) => database.saveSell(datetime, price, amount).then(() => onBuys())

  socket.on('sell', ({ datetime, price, amount }) => onSell(datetime, price, amount))

})

server.listen(config.PORT)
