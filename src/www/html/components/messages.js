import { HTML, nHr } from '@brtmvdl/frontend'
import { TextHTML } from './text.js'

export class Message extends HTML {
  type = 'message'
  id = null
  method = null
  params = null

  constructor(id, method, params = {}) {
    super()
    this.id = id
    this.method = method
    this.params = params
  }

  onCreate() {
    super.onCreate()
    this.append(this.getHeaderHTML())
    this.append(this.getBodyHTML())
    this.append(this.getFooterHTML())
    this.append(new nHr())
  }

  getHeaderHTML() {
    const header = new HTML()
    header.setStyle('margin', '0rem 0rem 1rem 0rem')
    header.append(new TextHTML(this.type))
    header.append(new TextHTML(this.method))
    return header
  }

  getBodyHTML() {
    const body = new HTML()
    body.setStyle('margin', '0rem 0rem 1rem 0rem')
    body.append(new TextHTML(JSON.stringify(this.params)))
    return body
  }

  getFooterHTML() {
    const footer = new HTML()
    footer.setStyle('margin', '0rem 0rem 1rem 0rem')
    footer.append(new TextHTML(this.id))
    return footer
  }

  toJSON() {
    const { id, method, params } = this
    return { id, method, params }
  }

  toString() {
    return JSON.stringify(this.toJSON(), null, 4)
  }
}

export class SocketMessage extends Message {
  type = 'socket'

  constructor(event, extras = {}) {
    super(Date.now(), event, extras)
  }
}

export class openMessage extends SocketMessage {
  constructor(extras = {}) {
    super('open', extras)
  }

  getBodyHTML() { return new HTML() }
}

export class errorMessage extends SocketMessage {
  constructor(extras = {}) {
    super('error', extras)
  }
}

export class closeMessage extends SocketMessage {
  constructor(extras = {}) {
    super('close', extras)
  }
}

export class InputMessage extends Message {
  type = 'input'
}

export class OutputMessage extends Message {
  type = 'output'

  constructor(method, data = {}) {
    super(data.id, method, data.result)
    console.log(data.id, method, data.result)
  }
}

export class pingOutputMessage extends OutputMessage { }

export class timeOutputMessage extends OutputMessage { }

export class exchangeInfoOutputMessage extends OutputMessage { }

export class depthOutputMessage extends OutputMessage { }

export class tradesRecentOutputMessage extends OutputMessage { }

export class tradesHistoricalOutputMessage extends OutputMessage { }

export class tradesAggregateOutputMessage extends OutputMessage { }

export class klinesOutputMessage extends OutputMessage { }

export class uiKlinesOutputMessage extends OutputMessage { }

export class avgPriceOutputMessage extends OutputMessage { }

export class ticker24hrOutputMessage extends OutputMessage { }

export class tickerTradingDayOutputMessage extends OutputMessage { }

export class tickerOutputMessage extends OutputMessage { }

export class tickerPriceOutputMessage extends OutputMessage { }

export class tickerBookOutputMessage extends OutputMessage { }

export class sessionLogonOutputMessage extends OutputMessage { }

export class sessionStatusOutputMessage extends OutputMessage { }

export class sessionLogoutOutputMessage extends OutputMessage { }

export class orderTestOutputMessage extends OutputMessage { }

export class orderPlaceOutputMessage extends OutputMessage { }

export class orderStatusOutputMessage extends OutputMessage { }

export class orderCancelOutputMessage extends OutputMessage { }

export class orderCancelReplaceOutputMessage extends OutputMessage { }

export class openOrdersStatusOutputMessage extends OutputMessage { }

export class openOrdersCancelAllOutputMessage extends OutputMessage { }

export class orderListPlaceOutputMessage extends OutputMessage { }

export class orderListStatusOutputMessage extends OutputMessage { }

export class orderListCancelOutputMessage extends OutputMessage { }

export class openOrderListsStatusOutputMessage extends OutputMessage { }

export class sorOrderPlaceOutputMessage extends OutputMessage { }

export class sorOrderTestOutputMessage extends OutputMessage { }

export class accountStatusOutputMessage extends OutputMessage { }

export class accountCommissionOutputMessage extends OutputMessage { }

export class accountRateLimitsOrdersOutputMessage extends OutputMessage { }

export class allOrdersOutputMessage extends OutputMessage { }

export class allOrderListsOutputMessage extends OutputMessage { }

export class myTradesOutputMessage extends OutputMessage { }

export class myPreventedMatchesOutputMessage extends OutputMessage { }

export class myAllocationsOutputMessage extends OutputMessage { }
