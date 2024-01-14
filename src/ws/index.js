import http from 'http'
import { Server } from 'socket.io'

const server = http.createServer()
const io = new Server(server, { cors: { origin: '*' } })

io.on('connection', socket => {
  socket.emit('hello')

  socket.on('event', data => console.log('event', data))

  socket.on('hello', () => console.log('from client'))

  socket.on('disconnect', () => console.log('disconnect', socket))
})

server.listen(80)
