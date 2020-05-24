import { AbstractButtonView } from '../lib/index'
import { MDCMenu } from '@material/menu'

const locations = [
    { name: 'Altenwerder', bbox: '9.913144111633303,53.4933563216916,9.976959228515627,53.52058917602446' },
    { name: 'Baumwall', bbox: '9.962346553802492,53.534556130923875,9.994254112243654,53.54878620640468' },
    { name: 'Entenwerder', bbox: '10.029165744781496,53.51977270011646,10.061073303222658,53.53338282883542' },
    { name: 'Eurogate', bbox: '9.8807430267334,53.52046160270109,9.944558143615724,53.54767704447716' },
    { name: 'Finkenwerder', bbox: '9.856388568878176,53.53159730675626,9.888296127319338,53.54520363618779' },
    { name: 'Harburg Hafen', bbox: '9.968483448028564,53.46367889272259,10.000391006469728,53.47730703668159' },
    { name: 'Kleiner Grassbrook', bbox: '9.980628490448,53.52321710101889,10.012536048889162,53.5368261230996' },
    { name: 'Landungsbrücken', bbox: '9.949600696563722,53.53627776535167,9.981508255004885,53.54988259077543' },
    { name: 'Tollerort', bbox: '9.92417335510254,53.514822478053055,9.987988471984865,53.54204154293011' },
    { name: 'Entenwerder', bbox: '10.029165744781496,53.51977270011646,10.061073303222658,53.53338282883542' }
]

export class BookmarksButtonView extends AbstractButtonView {
    public name: string = 'Bookmarks'
    public textA: string = 'Bookmarks'
    public textB: string = ''
    public classList: string = 'mdc-icon-button material-icons mdc-top-app-bar__action-item--unbounded'
    private init: boolean = false
    private menu?: MDCMenu
    private style: string = 'icon'

    constructor(selector: string, style: string = 'icon') {
        super(selector)
        this.init = false
        this.style = style
        this.register('click', 'button.bookmarks', this.bookmarks)
        this.register('click', '.mdc-menu', this.selected)
    }

    private selected = async (ev: any): Promise<void> => {
        this.broadcast('map:bbox', { bbox: ev.target.closest('.mdc-list-item').dataset.bbox })
    }

    private bookmarks = async (): Promise<void> => {
        if (this.menu) {
            this.menu.open = true
        }
        this.element('button.bookmarks').blur()
    }

    public async content(ev?: any): Promise<DocumentFragment> {
        const html: string[] = []
        html.push(`<div class="mdc-menu-surface--anchor">`)
        html.push(`<button class="${this.class} bookmarks ${this.classList}" aria-label="${this.textA}">bookmarks</button>`)
        html.push(`<div class="mdc-menu mdc-menu-surface">`)
        html.push(`    <ul class="mdc-list" role="menu" aria-hidden="true" aria-orientation="vertical" tabindex="-1">`)
        for (const location of locations) {
            html.push(`        <li class="mdc-list-item" role="menuitem" data-bbox="${location.bbox}">`)
            html.push(`            <span class="mdc-list-item__text">${location.name}</span>`)
            html.push(`        </li>`)
        }
        html.push(`    </ul>`)
        html.push(`</div>`)
        html.push(`</div>`)

        return this.toDocumentFragment(html)
    }

    public render = async (): Promise<void> => {
        await this.beforeRender()
        this.element(this.replace, true).replaceWith(await this.content())
        await this.afterRender()

        if (!this.init) {
            this.init = true
            this.menu = new MDCMenu(this.element('.mdc-menu'))
        }
    }
}