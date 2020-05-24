import { AbstractButtonView } from '../lib/index'
import { Ship } from 'ais-tools'

export class LockButtonView extends AbstractButtonView {
    public name: string = 'LockButtonView'
    public textA: string = 'Lock'
    public textB: string = 'Unlock'
    public classList: string = 'mdc-button mdc-card__action mdc-card__action--button'
    public ship: Ship
    private init: boolean = false
    private locked: boolean = false

    constructor(selector: string, ship: Ship) {
        super(selector)
        this.ship = ship
        this.init = false

        this.register('click', 'button.toggle-lock', this.toggleLock)
        this.subscribe(`response:locked:mmsi`, this.update)
    }

    private update = (ev: any): void => {
        this.locked = false
        if (this.ship.MMSI === ev.detail) {
            this.locked = true
        }
        this.render()
    }

    private toggleLock = (): void => {
        if (this.locked) {
            this.broadcast('request:unlock:mmsi')
        } else {
            this.broadcast('request:lock:mmsi', { MMSI: this.ship.MMSI })
        }
        this.element('button.toggle-lock').blur()
    }

    public async content(): Promise<DocumentFragment> {
        let has = this.locked
        return this.toDocumentFragment(`<button
            class="${this.class} toggle-lock ${this.classList}${has && ' mdc-button--outlined' || ''}"
            aria-label="${has && this.textB || this.textA}">${has && this.textB || this.textA}</button>`)
    }

    public render = async (): Promise<void> => {
        await this.beforeRender()
        this.element(this.replace, true).replaceWith(await this.content())
        await this.afterRender(false)

        if (!this.init) {
            this.init = true
            this.broadcast('request:locked:mmsi')
        }
    }
}