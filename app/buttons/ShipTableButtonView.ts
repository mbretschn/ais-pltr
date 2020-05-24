import { AbstractButtonView } from '../lib/index'

export class ShipTableButtonView extends AbstractButtonView {
    public name: string = 'ShipTableShow'
    public textA: string = 'Show Ship Table'
    public textB: string = 'Ship Table shown'
    public classList: string = 'mdc-icon-button material-icons mdc-top-app-bar__action-item--unbounded'
    public isShown: boolean = false
    private style: string = 'icon'

    constructor(selector: string, style: string = 'icon') {
        super(selector)
        this.style = style
        this.register('click', '.show-table', this.showTable)
        this.subscribe('view:showing', this.tableShown)
        this.subscribe('view:hidden', this.tableHidden)
    }

    private tableShown = (ev: any) => {
        if (ev.detail.name === 'ShipTableView') {
            this.isShown = true
            this.render()
        }
    }

    private tableHidden = (ev: any) => {
        if (ev.detail.name === 'ShipTableView') {
            this.isShown = false
            this.render()
        }
    }

    private showTable = (ev: any): void => {
        ev.preventDefault()
        this.broadcast('ships:table')
        this.element('.show-table').blur()
    }

    public async content(): Promise<DocumentFragment> {
        if (this.style !== 'icon') {
            return this.toDocumentFragment(`
                <a class="mdc-list-item ${this.class} show-table" href="#" aria-current="page"${this.isShown && ' disabled="disabled"'}>
                    <i class="material-icons mdc-list-item__graphic" aria-hidden="true">table_chart</i>
                    <span class="mdc-list-item__text">${!this.isShown && this.textA || this.textB}</span>
                </a>`)
        }

        return this.toDocumentFragment(`<button
            class="${this.class} show-table ${this.classList}"
            aria-label="${!this.isShown && this.textA || this.textB}"${this.isShown && ' disabled="disabled"'}>table_chart</button>`)
    }
}