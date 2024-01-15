import { HTML, nButton, nFlex } from '@brtmvdl/frontend'
import { io } from 'socket.io-client'

export class Page extends HTML {
  state = {
    socket: io('ws://0.0.0.0:8000'),
    buys: [],
    pairs: [],
  }

  children = {
    pairs_list: new HTML(),
    buys_list: new HTML(),
  }

  onCreate() {
    this.setText('Binance')
    this.setMessages()
    this.setSocketMessages()
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

    this.state.socket.on('buys', (data) => this.onBuys(data))
    this.state.socket.on('error buys', (err) => console.error(err))
  }

  onConnect() {
    this.state.socket.emit('hello')
  }

  setPairs(pairs = []) {
    this.state.pairs = pairs
    return this
  }

  getPairs() {
    return Array.from(this.state.pairs)
  }

  updatePairsList() {
    const pairs_list = new HTML()

    this.getPairs().map(({ symbol, price }) => {
      const html = new HTML()
      html.append(this.getBuyButton(symbol))
      html.append((new HTML()).setText(price))
      pairs_list.append(html)
    })

    this.children.pairs_list.clear()
    this.children.pairs_list.append(pairs_list)
  }

  onSymbolPriceTicker(data) {
    this.setPairs(data)
    this.updatePairsList()
    return this
  }

  onCheckServerTime(data) {
    console.log('check server time', data)
  }

  setBuys(data = []) {
    this.state.buys = data
    return this
  }

  getBuys() {
    return Array.from(this.state.buys)
  }

  updateBuysList() {
    const buys_list = new HTML()

    console.log('buys', this.getBuys()) // FIXME

    this.children.buys_list.clear()
    this.children.buys_list.append(buys_list)

  }

  onBuys(data) {
    this.setBuys(data)
    this.updateBuysList()
  }

  onBuyButtonClick({ value } = {}) {
    this.state.socket.emit('buy', value)
  }

  getPrice(symbol = '') {
    return this.getPairs().find((pair) => pair.symbol == symbol)['price']
  }

  getBuyButton(symbol, amount = 1) {
    const button = new nButton()
    const text = `buy ${amount} ${symbol}`
    button.setText(text)
    button.on('click', () => this.dispatchEvent('buy', { symbol, price: this.getPrice(symbol), amount }))
    return button
  }

  getPairsList() {
    return this.children.pairs_list
  }
}
