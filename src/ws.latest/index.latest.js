import http from 'http'
import { Server } from 'socket.io'
import * as constants from './constants.js'
import * as api from './api.js'
import * as database from './database.js'

const server = http.createServer()
const io = new Server(server, { cors: { origin: '*' } })

const PAIR = 'BNBBRL'

const pricesAndDiffs = (prices = [], datetime = Date.now()) => prices
  .map((price) => ({
    ...price,
    price_x: database.getOldestPriceSync(price.symbol, datetime - constants.DATETIME_X),
    price_y: database.getOldestPriceSync(price.symbol, datetime - constants.DATETIME_Y)
  }))

io.on('connection', socket => {
  const emit = (key, value = null) => [socket.emit(key, value), console.log('emit', key, value)]

  emit('hello')

  socket.on('hello', () => console.log('client hello'))

  const priceTickers = () => Promise.resolve(null)
    .then(() => database.getLatestPriceSync(PAIR))
    .then(() => pricesAndDiffs([price]))
    .then((prices) => emit('symbol price ticker', prices))
    .finally(() => priceTickers())

  priceTickers()

  const savePriceTickers = (datetime = Date.now()) => api.getTickerPrice(constants.getPairs())
    .then((prices) => database.savePairsPrices(prices, datetime))
    .then((price) => emit('save price ticker', price))
    .catch((err) => emit('error save price ticker', err))
    .finally(() => savePriceTickers())

  savePriceTickers()

  const onBuys = () => database.getAllBuys()
    .then((buys) => emit('buys', buys))

  socket.on('buys', () => onBuys())

  const onBuy = (symbol, price, amount = 1, datetime = Date.now()) => database.saveBuy(symbol, price, amount, datetime)
    .then((buy) => emit('buy', { symbol, price, amount, datetime }))
    .then(() => onBuys())

  socket.on('buy', ({ symbol, price, amount = 1 } = {}) => onBuy(symbol, price, amount))

  const onSell = (datetime, price, amount) => database.saveSell(datetime, price, amount)
    .then(() => onBuys())

  socket.on('sell', ({ datetime, price, amount }) => onSell(datetime, price, amount))
})

server.listen(constants.PORT)
