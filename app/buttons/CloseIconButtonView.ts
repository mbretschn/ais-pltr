import { AbstractView, AbstractButtonView } from '../lib/index'

export class CloseIconButtonView extends AbstractButtonView {
    public name: string = 'Close'
    public textA: string = 'Close'
    public textB: string = ''
    public classList: string = 'mdc-icon-button material-icons mdc-top-app-bar__action-item--unbounded'
    private view: AbstractView

    constructor(selector: string, view: AbstractView) {
        super(selector)
        this.view = view

        this.register('click', 'button.close', this.close)
    }

    public close = async (): Promise<void> => {
        await this.view.close()
    }

    public async content(ev?: any): Promise<DocumentFragment> {
        return this.toDocumentFragment(`<button
            class="${this.class} close ${this.classList}"
            aria-label="${this.textA}">clear</button>`)
    }
}