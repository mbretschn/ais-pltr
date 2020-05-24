import { AbstractButtonView } from '../lib/index'

export class MapShowAllFeaturesButtonView extends AbstractButtonView {
    public name: string = 'MapShowAllFeaturesButtonView'
    public textA: string = 'Show all features'
    public textB: string = 'All features shown'
    public classList: string = 'mdc-icon-button material-icons mdc-top-app-bar__action-item--unbounded'
    private style: string = 'icon'

    constructor(selector: string, style: string = 'icon') {
        super(selector)
        this.style = style

        this.register('click', '.show-all', this.showAll)
        this.subscribe('map:zoom', this.render)
    }

    private showAll = (ev: any): void => {
        ev.preventDefault()
        this.broadcast('map:show:all:features')
        this.element('.show-all').blur()
    }

    public async content(ev?: any): Promise<DocumentFragment> {
        let has = ev ? ev.detail.allFeaturesShown : true

        if (this.style !== 'icon') {
            return this.toDocumentFragment(`
                <a class="mdc-list-item ${this.class} show-all" href="#" aria-current="page" tabindex="0"${has && ' disabled="disabled"'}>
                    <i class="material-icons mdc-list-item__graphic" aria-hidden="true">zoom_out_map</i>
                    <span class="mdc-list-item__text">${!has && this.textA || this.textB}</span>
                </a>`)
        }

        return this.toDocumentFragment(`<button
            class="${this.class} show-all ${this.classList}"
            aria-label="${!has && this.textA || this.textB}"${has && ' disabled="disabled"'}>zoom_out_map</button>`)
    }
}