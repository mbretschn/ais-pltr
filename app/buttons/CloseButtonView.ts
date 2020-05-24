import { AbstractView, AbstractButtonView } from '../lib/index'

export class CloseButtonView extends AbstractButtonView {
    public name: string = 'Close'
    public textA: string = 'Close'
    public textB: string = ''
    public classList: string = 'mdc-button mdc-card__action mdc-card__action--button'
    private view: AbstractView

    constructor(selector: string, view: AbstractView) {
        super(selector)
        this.view = view

        this.register('click', 'button.close', this.close)
    }

    public close = async (): Promise<void> => {
        await this.view.close()
    }

    public async content(): Promise<DocumentFragment> {
        return this.toDocumentFragment(`<button
            class="${this.class} close ${this.classList}"
            aria-label="${this.textA}">${this.textA}</button>`)
    }
}