import { MDCDrawer } from "@material/drawer"
import { AbstractLayer } from '../lib'
import { MapShowAllFeaturesButtonView, TrackCollectionButtonView, ShipTableButtonView, StatisticsButtonView, TrackHistoryButtonView } from '../buttons'

export class DrawerView extends AbstractLayer {
    public name: string = 'Drawer'
    public selector: string = 'aside'
    private drawer?: MDCDrawer

    constructor() {
        super()

        this.add('trackCol', new TrackCollectionButtonView(this.selector, 'nav'))
        this.add('showAll', new MapShowAllFeaturesButtonView(this.selector, 'nav'))
        this.add('ships', new ShipTableButtonView(this.selector, 'nav'))
        this.add('statistics', new StatisticsButtonView(this.selector, 'nav'))
        this.add('history', new TrackHistoryButtonView(this.selector))

        this.subscribe('menu:clicked', this.toggleDrawer)
        this.subscribe('map:clicked', this.drawerClose)

        this.subscribe('track:collection:panel', this.drawerClose)
        this.subscribe('map:show:all:features', this.drawerClose)
        this.subscribe('ships:table', this.drawerClose)
        this.subscribe('request:unlock:mmsi', this.drawerClose)
        this.subscribe('request:statistics:show', this.drawerClose)
    }

    private toggleDrawer = () => {
        if (!this.drawer) {
            return
        }
        this.drawer.open = !this.drawer.open
    }

    private drawerClose = () => {
        if (!this.drawer) {
            return
        }
        this.drawer.open = false
    }

    public async content(): Promise<void> {
        this.el.prepend(this.aside())
    }

    private aside = (): DocumentFragment => {
        const html: string[] = []

        html.push(`<div class="mdc-drawer__content">
            <nav class="mdc-list">`)

        html.push(this.get('showAll').preRender())
        html.push(this.get('history').preRender())
        html.push(this.get('trackCol').preRender())
        html.push(this.get('ships').preRender())
        html.push(this.get('statistics').preRender())
        
        html.push(`</nav>
            </div>`)

        return this.toDocumentFragment(html)
    }

    public async render(): Promise<void> {
        this.el = document.querySelector(this.selector) as HTMLDivElement

        this.beforeRender()

        await this.content()

        this.drawer = new MDCDrawer(this.el)

        await this.afterRender(false)
    }
}
