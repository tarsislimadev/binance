import { HTML, nH1, nFlex, nButton, nSelectGroup } from '@brtmvdl/frontend'
import { io } from 'socket.io-client'

export class Page extends HTML {

  state = {
    socket: io('ws://0.0.0.0:8000'),
  }

  children = {
    amount_select_group: new nSelectGroup(),
    pairs_select_group: new nSelectGroup(),
    list: new HTML(),
  }

  onCreate() {
    this.setStyles()
    this.append(this.getTitle())
    this.setMessages()
    this.setSocketMessages()
    this.append(this.getForm())
    this.append(this.getList())
  }

  setStyles() {
    this.setStyle('margin', '0 auto')
    this.setStyle('width', '40rem')
  }

  getTitle() {
    const h1 = new nH1()
    h1.setText('Binance')
    return h1
  }

  setMessages() {
    return this
  }

  onConnect() {
    this.state.socket.emit('hello')
    return this
  }

  setSocketMessages() {
    this.state.socket.on('connect', () => this.onConnect())
    this.state.socket.on('hello', () => console.log('server hello'))
    return this
  }

  emit(key, value = '') {
    console.log(key, value)
    this.state.socket.emit(key, value)
    return this
  }

  getPairsSelectGroup() {
    this.children.pairs_select_group.children.select.addOption('BTCBRL', 'BTCBRL')
    this.children.pairs_select_group.children.select.addOption('ETHBRL', 'ETHBRL')
    this.children.pairs_select_group.children.select.addOption('XRPBRL', 'XRPBRL')
    this.children.pairs_select_group.children.select.addOption('SOLBRL', 'SOLBRL')
    this.children.pairs_select_group.children.select.addOption('BNBBRL', 'BNBBRL')
    this.children.pairs_select_group.children.select.addOption('USDTBRL', 'USDTBRL')
    return this.children.pairs_select_group
  }

  getStartButton() {
    const button = new nButton()
    button.setText('Start')
    button.on('click', () => this.emit('start'))
    return button
  }

  getStopButton() {
    const button = new nButton()
    button.setText('Stop')
    button.on('click', () => this.emit('stop'))
    return button
  }

  getAmountSelectGroup() {
    this.children.amount_select_group.children.select.addOption('10', '10')
    this.children.amount_select_group.children.select.addOption('20', '20')
    this.children.amount_select_group.children.select.addOption('50', '50')
    this.children.amount_select_group.children.select.addOption('100', '100')
    return this.children.amount_select_group
  }

  getBuyButton() {
    const button = new nButton()
    button.setText('Buy')
    button.on('click', () => this.emit('buy'))
    return button
  }

  getSellButton() {
    const button = new nButton()
    button.setText('Sell')
    button.on('click', () => this.emit('sell'))
    return button
  }

  getForm() {
    const html = new nFlex()
    html.append(this.getPairsSelectGroup())
    html.append(this.getStartButton())
    html.append(this.getStopButton())
    html.append(this.getAmountSelectGroup())
    html.append(this.getBuyButton())
    html.append(this.getSellButton())
    return html
  }

  getList() {
    return this.children.list
  }
}
