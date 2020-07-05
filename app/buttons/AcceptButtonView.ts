import { AbstractView, AbstractButtonView } from '../lib/index'

export class AcceptButtonView extends AbstractButtonView {
    public name: string = 'Accept'
    public textA: string = ''
    public textB: string = ''
    public classList: string = 'mdc-button mdc-card__action mdc-card__action--button'
    private view: AbstractView
    private isDisabled: boolean = true

    constructor(selector: string, text: string, view: AbstractView) {
        super(selector)
        this.view = view
        this.textA = text

        this.register('click', 'button.accept', this.close)
    }

    public set disable(isDisabled: boolean) {
        this.isDisabled = isDisabled
        this.render()
    }

    public close = async (): Promise<void> => {
        await this.view.accept()
    }

    public async content(): Promise<DocumentFragment> {
        return this.toDocumentFragment(`<button
            class="${this.class} accept ${this.classList}"${this.isDisabled && ' disabled="disabled"'}
            aria-label="${this.textA}">${this.textA}</button>`)
    }
}