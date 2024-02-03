import { HTML } from '@brtmvdl/frontend'
import { InputTextGroupComponent } from './input-text-group.js'

export class ParamsComponent extends HTML {
  children = {
    symbol: new InputTextGroupComponent('symbol'),
    side: new InputTextGroupComponent('side'),
    type: new InputTextGroupComponent('type'),
    price: new InputTextGroupComponent('price'),
    quantity: new InputTextGroupComponent('quantity'),
    timeInForce: new InputTextGroupComponent('timeInForce'),
    timestamp: new InputTextGroupComponent('timestamp'),
    apiKey: new InputTextGroupComponent('apiKey'),
    signature: new InputTextGroupComponent('signature'),
    newOrderRespType: new InputTextGroupComponent('newOrderRespType'),
    recvWindow: new InputTextGroupComponent('recvWindow'),
    limit: new InputTextGroupComponent('limit'),
    fromId: new InputTextGroupComponent('fromId'),
    interval: new InputTextGroupComponent('interval'),
    startTime: new InputTextGroupComponent('startTime'),
    windowSize: new InputTextGroupComponent('windowSize'),
    orderId: new InputTextGroupComponent('orderId'),
    cancelReplace: new InputTextGroupComponent('cancelReplace'),
    cancelReplaceMode: new InputTextGroupComponent('cancelReplaceMode'),
    cancelOrigClientOrderId: new InputTextGroupComponent('cancelOrigClientOrderId'),
    origClientOrderId: new InputTextGroupComponent('origClientOrderId'),
    orderListId: new InputTextGroupComponent('orderListId'),
    endTime: new InputTextGroupComponent('endTime'),
    listenKey: new InputTextGroupComponent('listenKey'),
  }

  getComponent(component = '') {
    return this.children[component]
  }

  getValue(component = '') {
    return this.children[component].getValue()
  }
}
