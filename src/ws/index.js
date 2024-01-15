import http from 'http'
import { Server } from 'socket.io'

import * as constants from './constants.js'
import * as api from './api.js'
import * as database from './database.js'

const server = http.createServer()
const io = new Server(server, { cors: { origin: '*' } })

const maySell = (buy) => database.getAllPrices()
  .then((prices) => prices.filter((price) => price.symbol == buy.symbol))
  .then((prices) => prices.sort((a, b) => a.datetime - b.datetime))
  .then((prices) => prices.find(() => true))
  .then((price) => price > buy.price)

const maySellBuy = (buy) => ({ ...buy, maySell: maySell(buy) })

const buys = () => database.getAllBuys()
  .then((buys) => buys.map((buy) => maySellBuy(buy)))
  .then((buys) => io.emit('buys', buys))
  .catch((err) => io.emit('error buys', err))
  .finally(() => setTimeout(buys, 1000))

buys()

io.on('connection', socket => {
  socket.emit('hello')

  socket.on('hello', () => console.log('client hello'))

  const priceTickers = () => api.tickerPrice(constants.PAIRS)
    .then((prices) => [socket.emit('symbol price ticker', prices), database.savePairsPrices(prices)])
    .catch((err) => socket.emit('error symbol price ticker', err))
    .finally(() => priceTickers())

  priceTickers()

  const onServerTime = () => api.time()
    .then((time) => socket.emit('check server time', time))
    .catch((err) => socket.emit('error check server time', err))

  socket.on('check server time', () => onServerTime())

  const onBuy = (symbol, price, amount = 1, datetime = Date.now()) => database.saveBuy(symbol, price, amount, datetime)
    .then((buy) => socket.emit('buy', { symbol, price, amount, datetime }))
    .catch((err) => socket.emit('buy error', err))

  socket.on('buy', ({ symbol, price, amount = 1 } = {}) => onBuy(symbol, price, amount))

})

server.listen(80)
