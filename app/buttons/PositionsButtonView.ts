import { AbstractButtonView } from '../lib/index'
import { Ship } from 'ais-tools'

export class PositionsButtonView extends AbstractButtonView {
    public name: string = 'PositionsButtonView'
    public textA: string = 'Positions'
    public textB: string = 'Positions'
    public classList: string = 'mdc-button mdc-card__action mdc-card__action--button'
    public isShown: boolean = false
    public ship: Ship

    constructor(selector: string, ship: Ship) {
        super(selector)
        this.ship = ship

        this.register('click', 'button.show-positions', this.showPositions)
        this.subscribe('view:showing', this.positionsShown)
        this.subscribe('view:hidden', this.positionsHidden)
    }

    private positionsShown = (ev: any) => {
        if (ev.detail.name === 'PositionTableView' && this.ship.MMSI === ev.detail.view.ship.MMSI) {
            this.isShown = true
            this.render()
        }
    }

    private positionsHidden = (ev: any) => {
        if (ev.detail.name === 'PositionTableView' && this.ship.MMSI === ev.detail.view.ship.MMSI) {
            this.isShown = false
            this.render()
        }
    }

    private showPositions = (): void => {
        this.broadcast('ship:positions', { ship: this.ship })
        this.element('button.show-positions').blur()
    }

    public async content(ev?: any): Promise<DocumentFragment> {
        return this.toDocumentFragment(`<button
            class="${this.class} show-positions ${this.classList}"
            aria-label="${!this.isShown && this.textA || this.textB}"${this.isShown && ' disabled="disabled"'}>${!this.isShown && this.textA || this.textB}</button>`)
    }
}