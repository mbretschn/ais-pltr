import { AbstractButtonView } from '../lib/index'
import { Ship } from 'ais-tools'

export class TrackHistoryButtonView extends AbstractButtonView {
    public name: string = 'TrackHistoryButtonView'
    public textA: string = 'Load Track History'
    public textB: string = 'Not load Track History'
    public classList: string = 'mdc-icon-button material-icons mdc-top-app-bar__action-item--unbounded'
    private init: boolean = false
    private locked: boolean = false

    constructor(selector: string,) {
        super(selector)
        this.init = false

        this.register('click', 'a.toggle-load-history', this.toggleLock)
        this.subscribe('response:load:history', this.update)
    }

    private update = (ev: any): void => {
        this.locked = ev.detail
        this.render()
    }

    private toggleLock = (): void => {
        this.broadcast('request:toggle:history')
        this.element('a.toggle-load-history').blur()
    }

    public async content(): Promise<DocumentFragment> {
        let has = this.locked

        return this.toDocumentFragment(`
            <a class="mdc-list-item ${this.class} toggle-load-history" href="#" aria-current="page" tabindex="0">
                <i class="material-icons mdc-list-item__graphic" aria-hidden="true">${has && 'history' || 'update'}</i>
                <span class="mdc-list-item__text">${has && this.textA || this.textB}</span>
            </a>`)
    }

    public render = async (): Promise<void> => {
        await this.beforeRender()
        this.element(this.replace, true).replaceWith(await this.content())
        await this.afterRender(false)

        if (!this.init) {
            this.init = true
            this.broadcast('request:load:history')
        }
    }
}