import { AbstractButtonView } from '../lib/index'

export class TrackCollectionButtonView extends AbstractButtonView {
    public name: string = 'TrackCollectionButtonView'
    public textA: string = 'Track Collection'
    public textB: string = 'Track Collection is empty'
    public classList: string = 'mdc-icon-button material-icons mdc-top-app-bar__action-item--unbounded'
    private style: string = 'icon'

    constructor(selector: string, style: string = 'icon') {
        super(selector)
        this.style = style
        this.register('click', '.show-panel', this.showPanel)
        this.subscribe('ship:track', this.update)
        this.subscribe('response:track', this.render)
    }

    private update = (): void => {
        this.broadcast('request:track')
    }

    private showPanel = (): void => {
        this.broadcast('track:collection:panel')
        this.element('.show-panel').blur()
    }

    public async content(ev: any): Promise<DocumentFragment> {
        let can = ev && ev.detail || false

        if (this.style !== 'icon') {
            return this.toDocumentFragment(`
                <a class="mdc-list-item ${this.class} show-panel" href="#" aria-current="page"${!can && ' disabled="disabled"'}>
                    <i class="material-icons mdc-list-item__graphic" aria-hidden="true">list</i>
                    <span class="mdc-list-item__text">${can && this.textA || this.textB}</span>
                </a>`)
        }

        return this.toDocumentFragment(`<button
            class="${this.class} show-panel ${this.classList}"
            aria-label="${can && this.textA || this.textB}"${!can && ' disabled="disabled"'}>list</button>`)
    }
}