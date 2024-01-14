import { HTML, nButton } from '@brtmvdl/frontend'
import { io } from 'socket.io-client'

export class Page extends HTML {

  state = {
    socket: io('ws://0.0.0.0:8000')
  }

  children = {
    list_pairs_button: new nButton(),
    pairs: new HTML(),
  }

  onCreate() {
    this.setText('Page')
    this.setSocketMessages()
    this.append(this.getListPairsButton())
    this.append(this.getPairs())
  }

  setSocketMessages() {
    this.state.socket.on('connect', () => this.state.socket.emit('hello'))
    this.state.socket.on('hello', () => console.log('from server'))
    this.state.socket.on('list pairs', (data) => console.log('list pairs', data))
  }

  getListPairsButton() {
    this.children.list_pairs_button.setText('list pairs')
    this.children.list_pairs_button.on('click', () => this.state.socket.emit('list pairs'))
    return this.children.list_pairs_button
  }

  getPairs() {
    return this.children.pairs
  }
}
