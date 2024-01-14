import { HTML } from '@brtmvdl/frontend'
import { io } from 'socket.io-client'

export class Page extends HTML {
  state = {
    socket: io('ws://0.0.0.0:8000')
  }

  onCreate() {
    this.setText('Page')
    this.setSocketMessages()
  }

  setSocketMessages() {
    this.state.socket.on('connect', () => this.state.socket.emit('hello'))
    
    this.state.socket.on('hello', () => console.log('from server'))
  }
}
