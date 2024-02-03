import { HTML, nSelect } from '@brtmvdl/frontend'

export class SelectComponent extends nSelect {
  onCreate() {
    super.onCreate()
    this.setStyle('padding', 'calc(1rem / 4)')
    this.setStyle('margin', '0rem 0rem 1rem 0rem')
  }
}
