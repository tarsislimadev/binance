import { HTML, nButton } from '@brtmvdl/frontend'
import { io } from 'socket.io-client'

export class Page extends HTML {

  state = {
    socket: io('ws://0.0.0.0:8000')
  }

  children = {
    list_pairs_button: new nButton(),
    check_server_time: new nButton(),
    pairs: new HTML(),
  }

  onCreate() {
    this.setText('Binance')
    this.setSocketMessages()
    this.append(this.getListPairsButton())
    this.append(this.getCheckServerTimeButton())
    this.append(this.getPairs())
  }

  setSocketMessages() {
    this.state.socket.on('connect', () => this.state.socket.emit('hello'))
    this.state.socket.on('hello', () => console.log('server hello'))

    this.state.socket.on('symbol price ticker', (data) => console.log('symbol price ticker', data))
    this.state.socket.on('error symbol price ticker', (err) => console.error(err))

    this.state.socket.on('check server time', (data) => console.log('check server time', data))
    this.state.socket.on('error check server time', (err) => console.error(err))
  }

  getListPairsButton() {
    this.children.list_pairs_button.setText('Symbol Price Ticker')
    this.children.list_pairs_button.on('click', () => this.state.socket.emit('symbol price ticker'))
    return this.children.list_pairs_button
  }

  getCheckServerTimeButton() {
    this.children.check_server_time.setText('Check Server Time')
    this.children.check_server_time.on('click', () => this.state.socket.emit('check server time'))
    return this.children.check_server_time
  }

  getPairs() {
    return this.children.pairs
  }
}
