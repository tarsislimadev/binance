import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'

const app = express()
const server = createServer(app)
const io = new Server(server, { cors: { origin: '*' } })

io.on('connection', (socket) => {
  const send = (message = {}) => {
    console.log('send', message)
  }

  const retrieve = (message = {}) => {
    console.log('retrieve', message)
  }

  send({ Endpoint: 'Hello', Payload: null })

  socket.on('Logout', (Payload) => console.log('Logout', { Endpoint: 'Logout', Payload }))
})

server.listen(80)
