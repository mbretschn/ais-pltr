import { AbstractButtonView } from '../lib/index'

export class ShowDrawerButtonView extends AbstractButtonView {
    public name: string = 'ShowDrawerButtonView'
    public textA: string = 'Show menu'
    public textB: string = 'Menu shown'
    public classList: string = 'mdc-icon-button material-icons mdc-top-app-bar__action-item--unbounded'

    constructor(selector: string) {
        super(selector)
        this.register('click', 'button.drawer-show', this.zoomIn)
    }

    public zoomIn = (): void => {
        this.broadcast('menu:clicked')
        this.element('button.drawer-show').blur()
    }

    public async content(ev?: any): Promise<DocumentFragment> {
        return this.toDocumentFragment(`<button
            class="${this.class} drawer-show ${this.classList}"
            aria-label="${this.textA}">menu</button>`)
    }
}