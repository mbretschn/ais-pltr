import { AbstractButtonView } from '../lib/index'
import { Ship } from 'ais-tools'

export class PositionTabButtonView extends AbstractButtonView {
    public name: string = 'PositionTabButtonView'
    public textA: string = 'Position'
    public textB: string = 'Position'
    public classList: string = 'mdc-button mdc-card__action mdc-card__action--button'
    public isShown: boolean = false
    public ship: Ship

    constructor(selector: string, ship: Ship) {
        super(selector)
        this.ship = ship

        this.register('click', 'button.show-position', this.showShipdata)
        this.subscribe('ship:position:shown', this.positionShown)
        this.subscribe('ship:position:hidden', this.positionHidden)
    }

    private positionShown = (ev: any) => {
        this.isShown = true
        this.render()
    }

    private positionHidden = (ev: any) => {
        this.isShown = false
        this.render()
    }

    private showShipdata = (): void => {
        this.broadcast('ship:details:position', { ship: this.ship })
        this.element('button.show-position').blur()
    }

    public async content(ev?: any): Promise<DocumentFragment> {
        return this.toDocumentFragment(`<button
            class="${this.class} show-position ${this.classList}"
            aria-label="${!this.isShown && this.textA || this.textB}"${this.isShown && ' disabled="disabled"'}>${!this.isShown && this.textA || this.textB}</button>`)
    }
}