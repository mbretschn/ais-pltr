import { AbstractView, AbstractButtonView } from '../lib/index'

export class RefreshButtonView extends AbstractButtonView {
    public name: string = 'Refresh'
    public textA: string = 'Refresh'
    public textB: string = ''
    public classList: string = 'mdc-button mdc-card__action mdc-card__action--button'
    private view: AbstractView

    constructor(selector: string, view: AbstractView) {
        super(selector)
        this.view = view

        this.register('click', 'button.refresh', this.refresh)
    }

    public refresh = async (): Promise<void> => {
       await this.view.refresh()
    }

    public async content(): Promise<DocumentFragment> {
        return this.toDocumentFragment(`<button
            class="${this.class} refresh ${this.classList}"
            aria-label="${this.textA}">${this.textA}</button>`)
    }
}