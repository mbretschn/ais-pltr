import { AbstractButtonView } from '../lib/index'
import { Ship } from 'ais-tools'

export class DetailsButtonView extends AbstractButtonView {
    public name: string = 'DetailsButtonView'
    public textA: string = 'Details'
    public textB: string = 'Details'
    public classList: string = 'mdc-button mdc-card__action mdc-card__action--button'
    public isShown: boolean = false
    public ship: Ship

    constructor(selector: string, ship: Ship) {
        super(selector)
        this.ship = ship

        this.register('click', 'button.show-details', this.showDetails)
        this.subscribe('view:showing', this.detailsShown)
        this.subscribe('view:hidden', this.detailsHidden)
    }

    private detailsShown = (ev: any) => {
        if (ev.detail.name === 'ShipDetailsView' && this.ship.MMSI === ev.detail.view.ship.MMSI) {
            this.isShown = true
            this.render()
        }
    }

    private detailsHidden = (ev: any) => {
        if (ev.detail.name === 'ShipDetailsView' && this.ship.MMSI === ev.detail.view.ship.MMSI) {
            this.isShown = false
            this.render()
        }
    }

    private showDetails = (): void => {
        this.broadcast('ship:detail', { ship: this.ship })
        this.element('button.show-details').blur()
    }

    public async content(ev?: any): Promise<DocumentFragment> {
        return this.toDocumentFragment(`<button
            class="${this.class} show-details ${this.classList}"
            aria-label="${!this.isShown && this.textA || this.textB}"${this.isShown && ' disabled="disabled"'}>${!this.isShown && this.textA || this.textB}</button>`)
    }
}