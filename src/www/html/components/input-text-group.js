import { HTML, nInputTextGroup, nLabel, nInputText, nError } from '@brtmvdl/frontend'
import { InputTextComponent } from './input-text.js'
import { LabelComponent } from './label.js'

export class InputTextGroupComponent extends nInputTextGroup {
  state = {
    label: '',
    value: '',
  }

  children = {
    label: new LabelComponent(),
    input: new InputTextComponent(),
    error: new nError(),
  }

  constructor(label = '', value = '') {
    super()
    this.state.label = label
    this.state.value = value
  }

  onCreate() {
    super.onCreate()
    this.children.label.setStyle('margin', '0rem 0rem 1rem 0rem')
    this.children.label.setText(this.state.label)
    this.children.input.setStyle('padding', 'calc(1rem / 4) 0rem calc(1rem / 4) 0rem')
    this.children.input.setPlaceholder(this.state.label)
    this.children.input.setValue(this.state.value)
  }
}
