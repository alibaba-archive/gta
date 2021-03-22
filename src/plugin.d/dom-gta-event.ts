import { GTA } from 'types'
import { parseGTA } from 'utils'

const matches = (el: HTMLElement, selector: string) =>
  (el.matches || (el as any).matchesSelector ||
  (el as any).msMatchesSelector || (el as any).mozMatchesSelector ||
  el.webkitMatchesSelector || (el as any).oMatchesSelector || (() => false)).call(el, selector)

const kName = 'domevent'

export class DOMGTAEventPlugin {
  static pluginName = kName

  name = kName

  constructor(private gta: GTA) {
    (document.body || document).addEventListener('click', this.onClick, true)
  }

  onClick = (evt: MouseEvent) => {
    setTimeout(() => this.handleEvent(evt), 0)
  }

  handleEvent = (evt: MouseEvent) => {
    let el = evt.target as HTMLElement | null
    while (el) {
      const gtaString = el.dataset?.gta
      const gtaIgnore = el.dataset?.gtaIgnore
      const eventDetails = parseGTA(gtaString || '')
      if (eventDetails && (!gtaIgnore || matches(el, gtaIgnore))) {
        this.gta.event(eventDetails)
      }
      el = el.parentElement
    }
  }
}
