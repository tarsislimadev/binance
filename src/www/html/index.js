import { HTML, nFlex, nSelect, nButton } from '@brtmvdl/frontend'
import { getMethodsList, getParamsList } from './utils/lists.js'
import { ParamsComponent } from './components/index.js'

export class TextHTML extends HTML {
  text = null

  constructor(text = '') {
    super()
    this.text = text
  }

  onCreate() {
    this.setText(this.text)
  }
}

export class Page extends HTML {
  state = {
    socket: new WebSocket('wss://testnet.binance.vision/ws-api/v3'),
    messages: [],
  }

  children = {
    select: new nSelect(),
    inputs: new HTML(),
    button: new nButton(),
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
    const message = { id, method, params }
    this.state.messages.push(message)
    this.state.socket.send(JSON.stringify(message))
  }

  getMessages() {
    return this.children.messages
  }

  setSocketEvents() {
    this.state.socket.onopen = event => this.onOpen(event)
    this.state.socket.onmessage = event => this.onMessage(event)
    this.state.socket.onerror = event => this.onError(event)
    this.state.socket.onclose = event => this.onClose(event)
  }

  onOpen(event) {
    console.log({ method: 'open', event, params: { datetime: Date.now() } })
    this.appendMessage({ method: 'open', event, params: { datetime: Date.now() } })
  }

  onMessage(event) {
    console.log({ method: 'message', params: JSON.parse(event.data) })
    this.appendMessage({ method: 'message', params: JSON.parse(event.data) })
  }

  onError(event) {
    console.log({ method: 'error', event, params: { datetime: Date.now() } })
    this.appendMessage({ method: 'error', event, params: { datetime: Date.now() } })
  }

  onClose(event) {
    console.log({ method: 'close', event, params: { datetime: Date.now() } })
    this.appendMessage({ method: 'close', event, params: { datetime: Date.now() } })
  }

  appendMessage(message = {}) {
    this.children.messages.append(new TextHTML(JSON.stringify(message)))
  }
}
