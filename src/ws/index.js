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

  socket.on('symbol price ticker', () =>
    api.tickerPrice(constants.PAIRS)
      .then((prices) => [socket.emit('symbol price ticker', prices), database.savePairsPrices(prices)])
      .then(() => console.log('symbol price ticker'))
      .catch((err) => socket.emit('error symbol price ticker', err))
  )

  socket.on('check server time', () => {
    api.time()
      .then((time) => [socket.emit('check server time', time),])
      .then(() => console.log('check server time'))
      .catch((err) => socket.emit('error check server time', err))
  })
})

server.listen(80)
