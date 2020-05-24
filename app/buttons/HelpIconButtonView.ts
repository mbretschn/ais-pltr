import { AbstractButtonView } from '../lib/index'

export class HelpIconButtonView extends AbstractButtonView {
    public name: string = 'HelpIconButtonView'
    public textA: string = 'Show Help'
    public textB: string = 'Hide Help'
    public classList: string = 'mdc-icon-button material-icons mdc-top-app-bar__action-item--unbounded'
    private init: boolean = false
    private shown: boolean = false

    constructor(selector: string,) {
        super(selector)
        this.init = false

        this.register('click', 'button.help-btn', this.showHelp)
        this.subscribe(`response:help:shown`, this.update)
    }

    private update = (ev: any): void => {
        this.shown = ev.detail
        this.render()
    }

    private showHelp = (): void => {
        this.broadcast('request:show:help')
        this.element('button.help-btn').blur()
    }

    public async content(): Promise<DocumentFragment> {
        let has = this.shown
        return this.toDocumentFragment(`<button
            class="${this.class} help-btn ${this.classList}"${has && ' disabled="disabled"'}
            aria-label="${has && this.textB || this.textA}">help</button>`)
    }

    public render = async (): Promise<void> => {
        await this.beforeRender()
        this.element(this.replace, true).replaceWith(await this.content())
        await this.afterRender(false)

        if (!this.init) {
            this.init = true
            this.broadcast('request:help:shown')
        }
    }
}