import { AbstractButtonView } from '../lib/index'

export class MapZoomOutButtonView extends AbstractButtonView {
    public name: string = 'MapZoomOutButtonView'
    public textA: string = 'Zoom Out'
    public textB: string = 'Min Zoom reached'
    public classList: string = 'mdc-icon-button material-icons mdc-top-app-bar__action-item--unbounded'
    public isInit: boolean = false

    constructor(selector: string) {
        super(selector)
        this.register('click', 'button.zoom-out', this.zoomOut)
        this.subscribe('map:zoom', this.render)
    }

    private zoomOut = (): void => {
        this.broadcast('map:zoom:out')
        this.element('button.zoom-out').blur()
    }

    public async content(ev?: any): Promise<DocumentFragment> {
        let can = ev ? ev.detail.canZoomOut : false

        return this.toDocumentFragment(`<button
            class="${this.class} zoom-out ${this.classList}"
            aria-label="${can && this.textA || this.textB}"${!can && ' disabled="disabled"'}>remove</button>`)
    }
}