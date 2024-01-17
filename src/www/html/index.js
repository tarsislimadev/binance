import { HTML, nH1, nH2, nButton, nFlex, nInputTextGroup } from '@brtmvdl/frontend'
import { io } from 'socket.io-client'

export class Page extends HTML {
  state = {
    socket: io('ws://0.0.0.0:8000'),
    buys: [],
  }

  children = {
  }

  onCreate() {
    this.append(this.getTitle())
    this.setMessages()
    this.setSocketMessages()
  }

  getTitle() {
    const h1 = new nH1()
    h1.setText('Binance')
    return h1
  }

  setMessages() {
    return this
  }

  setSocketMessages() {
    this.state.socket.on('connect', () => this.onConnect())
    this.state.socket.on('hello', () => console.log('server hello'))
    return this
  }

  onConnect() {
    this.state.socket.emit('hello')
    return this
  }
}
