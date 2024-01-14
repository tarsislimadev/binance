import http from 'http'
import { Server } from 'socket.io'
import * as constants from './constants.js'

import { Database } from '@brtmvdl/database'
const db = new Database({ config: '/data', type: 'fs' })

const savePairsPrices = (prices = [], datetime = Date.now()) => prices.map(({ symbol, price } = {}) => {
  db.in('prices').new().writeMany({ symbol, price, datetime })
})

const server = http.createServer()
const io = new Server(server, { cors: { origin: '*' } })

io.on('connection', socket => {
  socket.emit('hello')

  socket.on('event', data => console.log('event', data))

  socket.on('hello', () => console.log('from client'))

  socket.on('list pairs', () =>
    fetch(`https://api4.binance.com/api/v3/ticker/price?symbols=[${constants.PAIRS.map(([a, b]) => `"${a}${b}"`).join(',')}]`)
      .then((res) => res.json())
      .then((prices) => [socket.emit('list pairs', prices), savePairsPrices(prices)])
      .then(() => console.log('list pairs'))
      .catch((err) => console.error(err))
  )

  socket.on('disconnect', () => console.log('disconnect', socket))
})

server.listen(80)
