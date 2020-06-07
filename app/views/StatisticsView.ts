import { AbstractView } from '../lib'
import { CloseButtonView, RefreshButtonView } from '../buttons'
import { StatisticsItemView } from './StatisticsItemView'

export class StatisticsView extends AbstractView {
    public name: string = 'StatisticsView'
    public selector: string = '.dialog.statistic'

    constructor() {
        super()
        
        this.add('hub-2673', new StatisticsItemView(this.selector, 'hub-2673', ['rpi-2673', 'rpi-2847', 'rpi-3262', 'hub-2847', 'hub-3262']))
        this.add('rpi-2673', new StatisticsItemView(this.selector, 'rpi-2673', ['rpi-2847', 'rpi-3262', 'hub-2673', 'hub-2847', 'hub-3262']))
        this.add('rpi-2847', new StatisticsItemView(this.selector, 'rpi-2847', ['rpi-2673', 'rpi-3262', 'hub-2673', 'hub-2847', 'hub-3262']))
        this.add('rpi-3262', new StatisticsItemView(this.selector, 'rpi-3262', ['rpi-2673', 'rpi-2847', 'hub-2673', 'hub-2847', 'hub-3262']))

        this.add('refresh', new RefreshButtonView(this.selector, this))
        this.add('close', new CloseButtonView(this.selector, this))
    }

    public show = async (): Promise<void> => {
        this.el.style.display = 'block'
        await this._show('zoomIn', this.element('.statistic-container'))
    }

    public hide = async (): Promise<void> => {
        await this._hide('zoomOut', this.element('.statistic-container'))
        this.el.style.display = 'none'
    }

    public close = async (): Promise<void> => {
        await this.remove()
        this.el.innerHTML = ''
    }

    public refresh = async (): Promise<void> => {
        this.get('hub-2673').render()
        this.get('rpi-2673').render()
        this.get('rpi-2847').render()
        this.get('rpi-3262').render()
    }

    public content = async (): Promise<void> => {
        this.el.prepend(await this.statContainer())
    }

    private async statContainer(): Promise<DocumentFragment> {
        let html: string[] = []

        const max: number = await new Promise(result => {
            document.addEventListener('response:ships', (ev: any) => result(ev.detail.cnt), { once: true })
            this.broadcast('request:ships')
        })

        html.push(`<div class="statistic-container">`)
        html.push(`<h2 class="mdc-dialog__title">Currently ${max} vessels on map</h2>`)
        html.push(`<div class="statistic-items">`)
        html.push(this.get('hub-2673').preRender())
        html.push(this.get('rpi-2673').preRender())
        html.push(this.get('rpi-2847').preRender())
        html.push(this.get('rpi-3262').preRender())
        html.push(`</div>`)
        html.push(`<div class="mdc-dialog__actions">`)
        html.push(this.get('refresh').preRender())
        html.push(this.get('close').preRender())
        html.push(`</div>`)
        html.push(`</div>`)

        return this.toDocumentFragment(html)
    }
}
