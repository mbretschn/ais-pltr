import { AbstractButtonView } from '../lib/index'
import { MDCMenu } from '@material/menu'

const locations = [
    { name: 'Altenwerder', bbox: '9.918594360351564,53.4943775503806,9.963612556457521,53.51540939026965' },
    { name: 'Entenwerder', bbox: '10.029165744781496,53.51977270011646,10.061073303222658,53.53338282883542' },
    { name: 'Eurogate', bbox: '9.893832206726076,53.520155425157576,9.938850402832033,53.54117447609501' },
    { name: 'Finkenwerder', bbox: '9.872868061065674,53.53423092544957,9.884122610092163,53.539484919847354' },
    { name: 'Harburg Hafen', bbox: '9.968204498291017,53.46610596774424,9.990713596343996,53.476630203102246' },
    { name: 'Kleiner Grassbrook', bbox: '9.997762441635134,53.52435879433168,10.009016990661623,53.529614013624354' },
    { name: 'Landungsbrücken', bbox: '9.964824914932253,53.54108521820673,9.981025457382204,53.54633836205931' },
    { name: 'Tollerort', bbox: '9.933485984802248,53.5225792701285,9.978504180908205,53.543597118326204' }
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