import { HTML, nButton, nFlex } from '@brtmvdl/frontend'
import { io } from 'socket.io-client'

export class Page extends HTML {

  state = {
    socket: io('ws://0.0.0.0:8000')
  }

  children = {
    pairs_list: new HTML(),
    list_pairs_button: new nButton(),
    check_server_time: new nButton(),
  }

  onCreate() {
    this.setText('Binance')
    this.setMessages()
    this.setSocketMessages()
    this.append(this.getListPairsButton())
    this.append(this.getCheckServerTimeButton())
    this.append(this.getPairsList())
  }

  setMessages() {
    this.on('buy', (data) => this.onBuyButtonClick(data))
  }

  setSocketMessages() {
    this.state.socket.on('connect', () => this.onConnect())
    this.state.socket.on('hello', () => console.log('server hello'))

    this.state.socket.on('symbol price ticker', (data) => this.onSymbolPriceTicker(data))
    this.state.socket.on('error symbol price ticker', (err) => console.error(err))

    this.state.socket.on('check server time', (data) => this.onCheckServerTime(data))
    this.state.socket.on('error check server time', (err) => console.error(err))
  }

  onConnect() {
    this.state.socket.emit('hello')
  }

  onSymbolPriceTicker(pairs) {
    const pairs_list = new HTML()

    pairs.map(({ symbol, price }) => {
      const flex = new nFlex()
      flex.setStyle('', '')
      flex.append((new HTML()).setText(symbol))
      flex.append((new HTML()).setText(price))
      flex.append(this.getBuyButton(symbol))
      pairs_list.append(flex)
    })

    this.children.pairs_list.clear()
    this.children.pairs_list.append(pairs_list)
  }

  onCheckServerTime(data) {
    console.log('check server time', data)
  }

  onBuyButtonClick({ value } = {}) {
    this.state.socket.emit('buy', value)
  }

  getBuyButton(symbol, amount = 1) {
    const button = new nButton()
    const text = `buy ${amount}${symbol}`
    button.setText(text)
    button.on('click', () => this.dispatchEvent('buy', { symbol, amount }))
    return button
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

  getPairsList() {
    return this.children.pairs_list
  }
}
