import { HTML, nFlex, nSelect, nButton } from '@brtmvdl/frontend'
import { getMethodsList, getParamsList } from './utils/lists.js'
import { ParamsComponent } from './components/index.js'

import { SelectComponent, ButtonComponent } from './components/index.js'

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

export class Message {
  id = null
  method = null
  params = null
  extras = null

  constructor(id, method, params = {}, extras = {}) {
    this.id = id
    this.method = method
    this.params = params
    this.extras = extras
  }

  toJSON() {
    const { id, method, params } = this
    return { id, method, params }
  }

  toString() {
    return JSON.stringify(this.toJSON(), null, 4)
  }
}

export class InputMessage extends Message { }

export class OutputMessage extends Message { }

export class SocketMessage extends Message {
  constructor(event, extras = {}) {
    super(Date.now(), event, null, extras)
  }
}

export class OpenMessage extends SocketMessage {
  constructor(extras = {}) {
    super('open', extras)
  }
}

export class ErrorMessage extends SocketMessage {
  constructor(extras = {}) {
    super('error', extras)
  }
}

export class CloseMessage extends SocketMessage {
  constructor(extras = {}) {
    super('close', extras)
  }
}

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
    const message = new InputMessage(id, method, params)
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
    // console.log({ method: 'open', event, params: { datetime: Date.now() } })
    return this.appendMessage(new OpenMessage(event))
  }

  onMessage(event) {
    const data = JSON.parse(event.data)
    // console.log({ method: 'message', data })
    return this.appendMessage(this.getOutputMessage(data))
  }

  getOutputMessage(data = {}) {
    const method = this.getMethodById(data.id)
    switch (method) {
      case '': return new Message(Date.now(), '')
    }
    return new OutputMessage(data.id, method, data.result, data)
  }

  getMethodById(params_id = '') {
    return this.state.messages.find(({ id }) => id === params_id)?.method
  }

  onError(event) {
    // console.log({ method: 'error', event, params: { datetime: Date.now() } })
    return this.appendMessage(new ErrorMessage(event))
  }

  onClose(event) {
    // console.log({ method: 'close', event, params: { datetime: Date.now() } })
    return this.appendMessage(new CloseMessage(event))
  }

  appendMessage(message = new Message()) {
    this.state.messages.push(message.toJSON())
    this.children.messages.prepend(new TextHTML(message.toString()))
    return this
  }
}
