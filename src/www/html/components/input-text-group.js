import { HTML, nInputTextGroup } from '@brtmvdl/frontend'

export class InputTextGroupComponent extends nInputTextGroup {
  label = ''
  value = ''

  constructor(text = '', value = '') {
    super()
    this.text = text
    this.value = value
  }

  onCreate() {
    super.onCreate()
    this.children.label.setText(this.label)
    this.children.input.setPlaceholder(this.label)
    this.children.input.setValue(this.value)
  }
}
