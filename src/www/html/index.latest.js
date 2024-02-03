import { HTML, nFlex } from '@brtmvdl/frontend'
import { InputTextGroupComponent, ButtonComponent } from './components/index.js'

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
    socket: new window.WebSocket('wss://ws-api.binance.com:443/ws-api/v3'),
  }

  children = {
    url: new InputTextGroupComponent(),
    connect: new ButtonComponent(),
    message: new InputTextGroupComponent(),
    send: new ButtonComponent(),
    messages: new HTML(),
  }

  onCreate() {
    this.append(this.getMessageForm())
    this.append(this.getMessagesHTML())
    this.setSocketevents()
  }

  setSocketevents() {
    this.state.socket.onopen = event => this.onOpen(event)
    this.state.socket.onmessage = event => this.onMessage(event)
    this.state.socket.onerror = event => this.onError(event)
    this.state.socket.onclose = event => this.onClose(event)
  }

  onOpen() {
    this.appendMessage({ open: Date.now() })
  }

  onMessage({ data } = {}) {
    this.appendMessage(JSON.parse(data))
  }

  onError({ message }) {
    this.appendMessage({ message })
  }

  onClose() {
    this.appendMessage({ close: Date.now() })
  }

  appendMessage(message = {}) {
    this.children.messages.append(new TextHTML(JSON.stringify(message)))
  }

  getMessageForm() {
    const main = new nFlex()
    main.append(this.getMessageInput())
    main.append(this.getSendButton())
    return main
  }

  getMessageInput() {
    this.children.message.children.input.setPlaceholder('message')
    return this.children.message
  }

  getSendButton() {
    this.children.send.setText('send')
    this.children.send.on('click', () => this.onSend())
    return this.children.send
  }

  onSend() {
    const message = this.children.message.getValue()
    if (this.state.socket) {
      console.log('socket send', message);
      this.state.socket.send(message);
    } else {
      console.log('no socket to send', message);
    }
  }

  getMessagesHTML() {
    return this.children.messages
  }
}
