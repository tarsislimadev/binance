import { HTML, nH1, nH2, nButton, nFlex, nInputTextGroup } from '@brtmvdl/frontend'
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
    amount_input: new nInputTextGroup(),
  }

  onCreate() {
    this.append(this.getTitle())
    this.setMessages()
    this.setSocketMessages()
    this.append(this.getAmountInput())
    this.append(this.getPairsList())
    this.append(this.getBuysList())
  }

  getTitle() {
    const h1 = new nH1()
    h1.setText('Binance')
    return h1
  }

  setMessages() {
    this.on('buy', (data) => this.onBuyButtonClick(data))
    return this
  }

  setSocketMessages() {
    this.state.socket.on('connect', () => this.onConnect())
    this.state.socket.on('hello', () => console.log('server hello'))

    this.state.socket.on('symbol price ticker', (data) => this.onSymbolPriceTicker(data))
    this.state.socket.on('error symbol price ticker', (err) => console.error(err))

    this.state.socket.on('check server time', (data) => this.onCheckServerTime(data))
    this.state.socket.on('error check server time', (err) => console.error(err))

    this.state.socket.on('buy', (data) => this.onBuy(data))
    this.state.socket.on('error buy', (err) => console.error(err))

    this.state.socket.on('buys', (data) => this.onBuysList(data))
    this.state.socket.on('error buys', (err) => console.error(err))
    return this
  }

  onConnect() {
    this.state.socket.emit('hello')
    return this
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
    this.children.pairs_list.append((new nH2()).setText('Pairs'))
    this.children.pairs_list.append(pairs_list)
    return this
  }

  setBuys(data = []) {
    this.state.buys = data
    return this
  }

  getBuys() {
    return Array.from(this.state.buys)
  }

  getPrice(symbol = '') {
    return this.getPairs().find((pair) => pair.symbol == symbol)['price']
  }

  getPriceDiff(symbol, price) {
    const symbol_price = this.getPrice(symbol)
    return +symbol_price - +price
  }

  getBuy(datetime) {
    return this.getBuys().find((buy) => buy.datetime == datetime)
  }

  onSellButtonClick(datetime, amount = 1) {
    const buy = this.getBuy(datetime)
    this.state.socket.emit('sell', { datetime, price: this.getPrice(buy.symbol), amount })
    return this
  }

  updateBuysList() {
    const buys_list = new HTML()

    this.getBuys().map(({ amount, datetime, price, symbol, sell_amount = null, sell_datetime = null, sell_price = null, }) => {
      const html = new HTML()
      html.append((new HTML()).setText(`symbol: ${symbol}`))
      html.append((new HTML()).setText(`datetime: ${datetime}`))
      html.append((new HTML()).setText(`amount: ${amount}`))
      html.append((new HTML()).setText(`price: ${price}`))
      html.append((new HTML()).setText(`price diff: ${this.getPriceDiff(symbol, price)}`))
      if (sell_datetime) {
        html.append((new HTML()).setText(`sell amount: ${sell_amount}`))
        html.append((new HTML()).setText(`sell datetime: ${sell_datetime}`))
        html.append((new HTML()).setText(`sell price: ${sell_price}`))
      } else {
        html.append((new nButton()).setText(`sell ${amount} ${symbol}`).on('click', () => this.onSellButtonClick(datetime)))
      }
      buys_list.append(html)
    })

    this.children.buys_list.clear()
    this.children.buys_list.append((new nH2()).setText('Buys'))
    this.children.buys_list.append((new nButton()).setText('update buys list').on('click', () => this.state.socket.emit('buys')))
    this.children.buys_list.append(buys_list)
    return this
  }

  onSymbolPriceTicker(data) {
    this.setPairs(data)
    this.updatePairsList()
    this.updateBuysList()
    return this
  }

  onCheckServerTime(data) {
    console.log('check server time', data)
    return this
  }

  onBuy(data) {
    this.state.socket.emit('buys')
    return this
  }

  onBuysList(data) {
    this.setBuys(data)
    return this
  }

  onBuyButtonClick({ value } = {}) {
    this.state.socket.emit('buy', value)
    return this
  }

  getAmountValue(symbol) {
    const value = this.children.amount_input.children.input.getValue()
    const price = this.getPrice(symbol)
    return +value / +price
  }

  getBuyButton(symbol) {
    const button = new nButton()
    const text = `buy ${symbol}`
    button.setText(text)
    button.on('click', () => this.dispatchEvent('buy', { symbol, price: this.getPrice(symbol), amount: this.getAmountValue(symbol) }))
    return button
  }

  getAmountInput() {
    this.children.amount_input.children.label.setText('Amount')
    this.children.amount_input.children.input.setAttr('type', 'number')
    return this.children.amount_input
  }

  getPairsList() {
    return this.children.pairs_list
  }

  getBuysList() {
    return this.children.buys_list
  }
}
