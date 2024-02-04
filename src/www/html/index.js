import { HTML, nFlex, nSelect, nButton } from '@brtmvdl/frontend'
import { getMethodsList, getParamsList } from './utils/lists.js'
import { ParamsComponent, SelectComponent, ButtonComponent } from './components/index.js'
import * as messages from './components/messages.js'

export class Page extends HTML {
  state = {
    socket: new WebSocket('wss://testnet.binance.vision/ws-api/v3'),
    messages: [],
  }

  children = {
    select: new SelectComponent(),
    inputs: new HTML(),
    button: new ButtonComponent(),
    messages: new HTML(),
    params: new ParamsComponent()
  }

  onCreate() {
    super.onCreate()
    this.append(this.getFlex())
    this.setSocketEvents()
  }

  getFlex() {
    const flex = new nFlex()
    flex.append(this.getForm())
    flex.append(this.getMessages())
    return flex
  }

  getForm() {
    const form = new HTML()
    form.append(this.getSelect())
    form.append(this.getInputs())
    form.append(this.getButton())
    return form
  }

  getSelect() {
    getMethodsList().map((method) => this.children.select.addOption(method, method))
    this.children.select.on('change', () => this.onSelectChange())
    return this.children.select
  }

  onSelectChange() {
    this.children.inputs.clear()
    Array.from(this.getSelectedParams()).map((param) => this.children.inputs.append(this.children.params.getComponent(param)))
  }

  getSelectedParams() {
    const value = getParamsList()[this.children.select.getValue()]
    return !!value ? value : []
  }

  getInputs() {
    return this.children.inputs
  }

  getButton() {
    this.children.button.setText('send')
    this.children.button.on('click', () => this.onButtonClick())
    return this.children.button
  }

  onButtonClick() {
    const method = this.children.select.getValue()
    const params = this.getSelectedParams().reduce((p, param) => ({ ...p, [param]: this.children.params.getValue(param) }), {})
    this.sendSocketMessage(method, params)
  }

  sendSocketMessage(method, params = {}, id = Date.now()) {
    const message = new messages.InputMessage(id, method, params)
    this.appendMessage(message)
    this.state.socket.send(message.toString())
  }

  getMessages() {
    return this.children.messages
  }

  setSocketEvents() {
    this.state.socket.addEventListener('open', (event) => this.onOpen(event))
    this.state.socket.addEventListener('message', (event) => this.onMessage(event))
    this.state.socket.addEventListener('error', (event) => this.onError(event))
    this.state.socket.addEventListener('close', (event) => this.onClose(event))
  }

  onOpen(event) {
    return this.appendMessage(new messages.openMessage(event))
  }

  onMessage(event) {
    const data = JSON.parse(event.data)
    return this.appendMessage(this.getOutputMessage(data))
  }

  getOutputMessage(data = {}) {
    const method = this.getMethodById(data.id)

    switch (method) {
      case 'ping': return new messages.pingOutputMessage(method, data)
      case 'time': return new messages.timeOutputMessage(method, data)
      case 'exchangeInfo': return new messages.exchangeInfoOutputMessage(method, data)
      case 'depth': return new messages.depthOutputMessage(method, data)
      case 'trades.recent': return new messages.tradesRecentOutputMessage(method, data)
      case 'trades.historical': return new messages.tradesHistoricalOutputMessage(method, data)
      case 'trades.aggregate': return new messages.tradesAggregateOutputMessage(method, data)
      case 'klines': return new messages.klinesOutputMessage(method, data)
      case 'uiKlines': return new messages.uiKlinesOutputMessage(method, data)
      case 'avgPrice': return new messages.avgPriceOutputMessage(method, data)
      case 'ticker.24hr': return new messages.ticker24hrOutputMessage(method, data)
      case 'ticker.tradingDay': return new messages.tickerTradingDayOutputMessage(method, data)
      case 'ticker': return new messages.tickerOutputMessage(method, data)
      case 'ticker.price': return new messages.tickerPriceOutputMessage(method, data)
      case 'ticker.book': return new messages.tickerBookOutputMessage(method, data)
      case 'session.logon': return new messages.sessionLogonOutputMessage(method, data)
      case 'session.status': return new messages.sessionStatusOutputMessage(method, data)
      case 'session.logout': return new messages.sessionLogoutOutputMessage(method, data)
      case 'order.test': return new messages.orderTestOutputMessage(method, data)
      case 'order.place': return new messages.orderPlaceOutputMessage(method, data)
      case 'order.status': return new messages.orderStatusOutputMessage(method, data)
      case 'order.cancel': return new messages.orderCancelOutputMessage(method, data)
      case 'order.cancelReplace': return new messages.orderCancelReplaceOutputMessage(method, data)
      case 'openOrders.status': return new messages.openOrdersStatusOutputMessage(method, data)
      case 'openOrders.cancelAll': return new messages.openOrdersCancelAllOutputMessage(method, data)
      case 'orderList.place': return new messages.orderListPlaceOutputMessage(method, data)
      case 'orderList.status': return new messages.orderListStatusOutputMessage(method, data)
      case 'orderList.cancel': return new messages.orderListCancelOutputMessage(method, data)
      case 'openOrderLists.status': return new messages.openOrderListsStatusOutputMessage(method, data)
      case 'sor.order.place': return new messages.sorOrderPlaceOutputMessage(method, data)
      case 'sor.order.test': return new messages.sorOrderTestOutputMessage(method, data)
      case 'account.status': return new messages.accountStatusOutputMessage(method, data)
      case 'account.commission': return new messages.accountCommissionOutputMessage(method, data)
      case 'account.rateLimits.orders': return new messages.accountRateLimitsOrdersOutputMessage(method, data)
      case 'allOrders': return new messages.allOrdersOutputMessage(method, data)
      case 'allOrderLists': return new messages.allOrderListsOutputMessage(method, data)
      case 'myTrades': return new messages.myTradesOutputMessage(method, data)
      case 'myPreventedMatches': return new messages.myPreventedMatchesOutputMessage(method, data)
      case 'myAllocations': return new messages.myAllocationsOutputMessage(method, data)
    }

    return new messages.OutputMessage(data.id, method, data.result, data)
  }

  getMethodById(params_id = '') {
    return this.state.messages.find(({ id }) => id === params_id)?.method
  }

  onError(event) {
    return this.appendMessage(new messages.errorMessage(event))
  }

  onClose(event) {
    return this.appendMessage(new messages.closeMessage(event))
  }

  appendMessage(message = new messages.Message()) {
    this.state.messages.push(message.toJSON())
    this.children.messages.prepend(message)
    return this
  }
}
