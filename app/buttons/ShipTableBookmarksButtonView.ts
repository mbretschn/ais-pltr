import { AbstractButtonView } from '../lib'

export class ShipTableBookmarksButtonView extends AbstractButtonView {
    public name: string = 'ShipTableBookmarksButtonView'
    public textA: string = 'Filter HADAG Ferries'
    public textB: string = 'Filtered by HADAG Ferries'
    public classList: string = 'mdc-icon-button material-icons mdc-top-app-bar__action-item--unbounded'
    public init: boolean = false
    private _filter: string = '211437250,211437260,211437300,211437160,211437240,211437190,211437280,211437330,211257820,211263850,211437270,211316150,211437470,211437320,211437290,211151080,211437340,211437770,211462080,211472760,211611680,211643790,211437180,211437310,211762670,211231260'

    constructor(selector: string) {
        super(selector)
        this.register('click', 'button.filter', this.filter)
        this.subscribe('ships:filtered', this.render)
    }

    private filter = async (): Promise<void> => {
        this.broadcast('ships:filter', { filter: this._filter })
        this.element('button.filter').blur()
    }

    public async content(ev?: any): Promise<DocumentFragment> {
        let can = ev && ev.detail.filter === this._filter ? false : true

        return this.toDocumentFragment(`<button
            class="${this.class} filter ${this.classList}"
            aria-label="${can && this.textA || this.textB}"${!can && ' disabled="disabled"'}>directions_boat</button>`)
    }
}