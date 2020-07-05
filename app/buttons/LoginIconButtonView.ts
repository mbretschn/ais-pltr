import { AbstractButtonView } from '../lib/index'

export class LoginIconButtonView extends AbstractButtonView {
    public name: string = 'LoginIconButtonView'
    public textA: string = 'login'
    public textB: string = 'logout'
    public classList: string = 'mdc-icon-button material-icons mdc-top-app-bar__action-item--unbounded'
    private init: boolean = false
    private text: string = 'login'

    constructor(selector: string,) {
        super(selector)

        this.register('click', 'button.login-btn', this.showHelp)
        this.subscribe(`response:login`, this.update)
    }

    private update = (ev: any): void => {
        this.text = ev.detail ? this.textB : this.textA
        this.render()
    }

    private showHelp = (): void => {
        if (this.text === 'login') {
            this.broadcast('request:show:login')
            this.element('button.login-btn').blur()
        } else {
            this.broadcast('request:logout')
        }
    }

    public async content(): Promise<DocumentFragment> {
        return this.toDocumentFragment(`<button
            class="${this.class} login-btn ${this.classList}"
            aria-label="${this.text}">${this.text}</button>`)
    }

    public render = async (): Promise<void> => {
        await this.beforeRender()
        this.element(this.replace, true).replaceWith(await this.content())

        await this.afterRender(false)

        if (!this.init) {
            this.init = true
            this.broadcast('request:login')
        }
    }
}