import { AbstractButtonView } from '../lib/index'

export class StatisticsButtonView extends AbstractButtonView {
    public name: string = 'StatisticsButtonView'
    public textA: string = 'Statistics'
    public textB: string = 'Statistics'
    public classList: string = 'mdc-icon-button material-icons mdc-top-app-bar__action-item--unbounded'
    private style: string = 'icon'

    constructor(selector: string, style: string = 'icon') {
        super(selector)
        this.style = style
        this.register('click', '.show-statistics', this.showPanel)
        this.subscribe('response:statistics:shown', this.render)
    }

    private showPanel = (): void => {
        this.broadcast('request:statistics:show')
        this.element('.show-statistics').blur()
    }

    public async content(ev: any): Promise<DocumentFragment> {
        let can = !(ev && ev.detail)

        if (this.style !== 'icon') {
            return this.toDocumentFragment(`
                <a class="mdc-list-item ${this.class} show-statistics" href="#" aria-current="page"${!can && ' disabled="disabled"'}>
                    <i class="material-icons mdc-list-item__graphic" aria-hidden="true">bar_chart</i>
                    <span class="mdc-list-item__text">${can && this.textA || this.textB}</span>
                </a>`)
        }

        return this.toDocumentFragment(`<button
            class="${this.class} show-statistics ${this.classList}"
            aria-label="${can && this.textA || this.textB}"${!can && ' disabled="disabled"'}>bar_chart</button>`)
    }
}