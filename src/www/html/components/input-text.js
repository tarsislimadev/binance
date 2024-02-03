import { HTML, nInputText } from '@brtmvdl/frontend'

export class InputTextComponent extends nInputText {
  onCreate() {
    super.onCreate()
    this.setStyle('box-shadow', 'inset 0rem 0rem 0rem 1px #000000')
    this.setStyle('padding', 'calc(1rem / 4) 0rem')
    this.setStyle('margin', 'calc(1rem / 4) 0rem')
    this.setStyle('border', 'none')
    this.setStyle('width', '100%')
  }
}
