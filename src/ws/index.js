import http from 'http'
import { Server } from 'socket.io'

import * as constants from './constants.js'
import * as api from './api.js'
import * as database from './database.js'

const server = http.createServer()
const io = new Server(server, { cors: { origin: '*' } })

io.on('connection', socket => {
  socket.emit('hello')

  socket.on('hello', () => console.log('client hello'))

  const getPriceTicker = () => api.tickerPrice(constants.PAIRS)
    .then((prices) => [socket.emit('symbol price ticker', prices), database.savePairsPrices(prices)])
    .then(() => getPriceTicker())
    .catch((err) => socket.emit('error symbol price ticker', err))

  getPriceTicker()

  const getServerTime = () => api.time()
    .then((time) => socket.emit('check server time', time))
    .catch((err) => socket.emit('error check server time', err))

  socket.on('check server time', () => getServerTime())

  const buy = (symbol, price, amount = 1, datetime = Date.now()) => database.saveBuy(symbol, price, amount, datetime)
    .then((buy) => socket.emit('buy', { symbol, price, amount, datetime }))
    .catch((err) => socket.emit('buy error', err))

  socket.on('buy', ({ symbol, price, amount = 1 } = {}) => buy(symbol, price, amount))

})

server.listen(80)
