import { AbstractButtonView } from '../lib/index'
import { Ship } from 'ais-tools'

export class UnlockIconButtonView extends AbstractButtonView {
    public name: string = 'LockButtonView'
    public textA: string = 'Lock'
    public textB: string = 'Unlock'
    public classList: string = 'mdc-icon-button material-icons mdc-top-app-bar__action-item--unbounded'
    private init: boolean = false
    private style: string = 'icon'

    constructor(selector: string, style: string = 'icon') {
        super(selector)
        this.init = false
        this.style = style

        this.register('click', '.toggle-lock', this.unlock)
        this.subscribe(`response:locked:mmsi`, this.render)
    }

    private unlock = (ev: any): void => {
        ev.preventDefault()
        this.broadcast('request:unlock:mmsi')
        this.element('.toggle-lock').blur()
    }

    public async content(ev: any): Promise<DocumentFragment> {
        let has = ev && ev.detail || false

        if (this.style !== 'icon') {
            return this.toDocumentFragment(`
                <a class="mdc-list-item ${this.class} toggle-lock" href="#" aria-current="page"${has && ' disabled="disabled"'}>
                    <i class="material-icons mdc-list-item__graphic" aria-hidden="true">${has && 'lock' || 'lock_open'}</i>
                    <span class="mdc-list-item__text">${!has && this.textA || this.textB}</span>
                </a>`)
        }

        return this.toDocumentFragment(`<button
            class="${this.class} toggle-lock ${this.classList}"${!has && ' disabled="disabled"'}
            aria-label="${has && this.textB || this.textA}">${has && 'lock' || 'lock_open'}</button>`)
    }

    public render = async (ev: any): Promise<void> => {
        await this.beforeRender()
        this.element(this.replace, true).replaceWith(await this.content(ev))
        await this.afterRender(false)

        if (!this.init) {
            this.init = true
            this.broadcast('request:locked:mmsi')
        }
    }
}