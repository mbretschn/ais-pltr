import { AbstractButtonView } from '../lib/index'
import { Ship } from 'ais-tools'

export class ShipTabButtonView extends AbstractButtonView {
    public name: string = 'ShipTabButtonView'
    public textA: string = 'Ship Data'
    public textB: string = 'Ship Data'
    public classList: string = 'mdc-button mdc-card__action mdc-card__action--button'
    public isShown: boolean = true
    public ship: Ship

    constructor(selector: string, ship: Ship) {
        super(selector)
        this.ship = ship

        this.register('click', 'button.show-data', this.showShipdata)
        this.subscribe('ship:data:shown', this.dataShown)
        this.subscribe('ship:data:hidden', this.dataHidden)
    }

    private dataShown = (ev: any) => {
        this.isShown = true
        this.render()
    }

    private dataHidden = (ev: any) => {
        this.isShown = false
        this.render()
    }

    private showShipdata = (): void => {
        this.broadcast('ship:details:data', { ship: this.ship })
        this.element('button.show-data').blur()
    }

    public async content(ev?: any): Promise<DocumentFragment> {
        return this.toDocumentFragment(`<button
            class="${this.class} show-data ${this.classList}"
            aria-label="${!this.isShown && this.textA || this.textB}"${this.isShown && ' disabled="disabled"'}>${!this.isShown && this.textA || this.textB}</button>`)
    }
}