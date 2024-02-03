import { HTML, nButton } from '@brtmvdl/frontend'

export class ButtonComponent extends nButton {
  onCreate() {
    super.onCreate()
    this.setStyle('background-color', '#000000')
    this.setStyle('padding', 'calc(1rem / 4)')
    this.setStyle('color', '#ffffff')
    this.setStyle('border', 'none')
    this.setStyle('width', '100%')
  }
}
