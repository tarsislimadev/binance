import { HTML } from '@brtmvdl/frontend'

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
