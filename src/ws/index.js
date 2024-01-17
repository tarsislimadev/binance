import http from 'http'
import { Server } from 'socket.io'
import * as api from './api.js'
import * as constants from './constants.js'
import * as database from './database.js'
import { EventEmitter } from 'events'

const server = http.createServer()
const io = new Server(server, { cors: { origin: '*' } })
const SYMBOL = 'AVAXBRL'
const ee = new EventEmitter()

const symbolDiffs = (price = {}, datetime = Date.now()) => ({
  ...price,
  datetime,
  price_x: database.getOldestPriceSync(price.symbol, datetime - constants.DATETIME_X),
  price_y: database.getOldestPriceSync(price.symbol, datetime - constants.DATETIME_Y)
})

const saveTickerPrice = () =>
  api.getTickerPrice(SYMBOL)
    .then(({ symbol, price, datetime = Date.now() }) => {
      database.savePriceSync(symbol, price, datetime)
      const s1 = symbolDiffs({ symbol, price, datetime })
      const buy = (+s1?.price_x?.price > +price && +price > +s1?.price_y?.price) ? '' : 'not'
      ee.emit(`may ${buy} buy`, s1)
      const sell = (+s1?.price_x?.price < +price && +price < +s1?.price_y?.price) ? '' : 'not'
      ee.emit(`may ${sell} buy`, s1)
    })
    .catch((err) => console.error(err))
    .finally(() => setTimeout(saveTickerPrice, 500))

saveTickerPrice()

io.on('connection', (socket) => {
  const emit = (key, value = null) => [socket.emit(key, value), console.log('emit', key, value)]

  emit('hello')

  socket.on('hello', () => console.log('client hello'))

  ee.on('may buy', (data) => emit('may buy', data))

  ee.on('may not buy', (data) => emit('may not buy', data))

  ee.on('may sell', (data) => emit('may sell', data))

  ee.on('may not sell', (data) => emit('may not sell', data))
})

server.listen(constants.PORT)
