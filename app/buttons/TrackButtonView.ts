import { AbstractButtonView } from '../lib/index'
import { Ship } from 'ais-tools'

export class TrackButtonView extends AbstractButtonView {
    public name: string = 'TrackButtonView'
    public textA: string = 'Track'
    public textB: string = 'Track'
    public classList: string = 'mdc-button mdc-card__action mdc-card__action--button'
    public ship: Ship
    private init: boolean = false
    private wait: boolean = false
    private has: boolean = false

    constructor(selector: string, ship: Ship) {
        super(selector)
        this.ship = ship
        this.wait = false
        this.has = false

        this.register('click', 'button.toggle-track', this.toggleTrack)
        this.subscribe('ship:track', this.update)
        this.subscribe(`response:track:${this.ship.MMSI}`, this.enable)
    }

    private enable = async (ev?: any): Promise<void> => {
        this.wait = false
        await this.render(ev)
    }

    private update = (ev: any) => {
        this.broadcast('request:track:mmsi', { MMSI: this.ship.MMSI })
    }

    private toggleTrack = async (): Promise<void> => {
        this.broadcast('ship:track:add', { ship: this.ship })
        this.element('button.toggle-track').blur()
        this.wait = !this.has
        await this.render()
    }

    public async content(ev?: any): Promise<DocumentFragment> {
        this.has = ev && ev.detail || false
        return this.toDocumentFragment(`<button
            class="${this.class} toggle-track ${this.classList}${this.has && ' mdc-button--outlined' || ''}"
            aria-label="${this.has && this.textB || this.textA}"${this.wait && ' disabled="disabled"'}>${this.has && this.textB || this.textA}</button>`)
    }

    public render = async (ev?: any): Promise<void> => {
        await this.beforeRender()
        this.element(this.replace, true).replaceWith(await this.content(ev))
        await this.afterRender()

        if (!this.init) {
            this.init = true
            this.broadcast('request:track:mmsi', { MMSI: this.ship.MMSI })
        }
    }
}