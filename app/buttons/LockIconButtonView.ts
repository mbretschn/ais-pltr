import { AbstractButtonView } from '../lib/index'
import { Ship } from 'ais-tools'

export class LockIconButtonView extends AbstractButtonView {
    public name: string = 'LockIconButtonView'
    public textA: string = 'Lock'
    public textB: string = 'Unlock'
    public classList: string = 'mdc-icon-button material-icons mdc-top-app-bar__action-item--unbounded'
    public ship: Ship
    private init: boolean = false
    private locked: boolean = false

    constructor(selector: string, ship: Ship) {
        super(selector)
        this.ship = ship
        this.init = false

        this.register('click', 'button.toggle-lock-icon', this.toggleLock)
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
        this.element('button.toggle-lock-icon').blur()
    }

    public async content(): Promise<DocumentFragment> {
        let has = this.locked
        return this.toDocumentFragment(`<button
            class="${this.class} toggle-lock-icon ${this.classList}"
            aria-label="${has && this.textB || this.textA}">${has && 'lock' || 'lock_open'}</button>`)
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