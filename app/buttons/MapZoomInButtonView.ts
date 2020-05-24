import { AbstractButtonView } from '../lib/index'

export class MapZoomInButtonView extends AbstractButtonView {
    public name: string = 'MapZoomInButtonView'
    public textA: string = 'Zoom In'
    public textB: string = 'Max Zoom reached'
    public classList: string = 'mdc-icon-button material-icons mdc-top-app-bar__action-item--unbounded'

    constructor(selector: string) {
        super(selector)
        this.register('click', 'button.zoom-in', this.zoomIn)
        this.subscribe('map:zoom', this.render)
    }

    public zoomIn = (): void => {
        this.broadcast('map:zoom:in')
        this.element('button.zoom-in').blur()
    }

    public async content(ev?: any): Promise<DocumentFragment> {
        let can = ev ? ev.detail.canZoomIn : false

        return this.toDocumentFragment(`<button 
            class="${this.class} zoom-in ${this.classList}" 
            aria-label="${can && this.textA || this.textB}"${!can && ' disabled="disabled"'}>add</button>`)
    }
}