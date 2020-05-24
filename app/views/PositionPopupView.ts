import { default as L, Popup } from 'leaflet'
import { default as moment } from 'moment'
import { NmeaPositionFeature } from 'ais-tools'
import { AbstractLayer } from '../lib'

export class PositionPopupView extends AbstractLayer {
    public name: string = 'PositionPopupView'
    public selector: string
    public position: NmeaPositionFeature
    private popup?: Popup

    constructor(position: NmeaPositionFeature) {
        super()

        this.position = position
        this.selector = `#popup-${this.position._id}`
    }

    content = async (): Promise<DocumentFragment> => {
        let html: string[] = []

        html.push(`<div class="popup-card__primary">`)
        html.push(`<h2 class="popup-card__title mdc-typography mdc-typography--headline6 unselectable">${this.position.format('TimeStamp')}</h2>`)
        html.push(`<h3 class="popup-card__subtitle mdc-typography mdc-typography--subtitle2 unselectable">COG: <b>${this.position.format('COG')}</b>, Moved: <b>${this.position.format('DistanceMoved')}</b></h3>`)
        html.push(`</div>`)
        html.push(`<div class="popup-card__secondary mdc-typography mdc-typography--body2 position-popup-content unselectable">`)
        for (const sender of this.position.Sender) {
            html.push(`<p><span class="label"><b>${sender.Name}</b></span> <span class="content">${moment.utc(sender.TimeStamp).format('HH:mm:ss')}</span></p>`)
        }
        html.push(`</div>`)
        html.push(`<div class="mdc-card__actions">`)
        html.push(`<div class="mdc-card__action-buttons">`)
        html.push(`</div>`)
        html.push(`</div>`)

        return this.toDocumentFragment(html)
    }

    public async render(): Promise<L.Popup> {
        this.el = document.createElement('div')
        this.el.setAttribute('id', `popup-${this.position._id}`)
        this.el.classList.add('mdc-card', 'popup-card')
        this.el.append(await this.content())

        this.popup = L.popup({
            autoPan: false,
            closeButton: true,
            autoClose: false,
            closeOnClick: false
        })

        this.popup.setContent(this.el)

        await this.beforeRender()

        this.popup.once('add', async () => {
            await this.afterRender()
        })

        return new Promise(resolve => resolve(this.popup))
    }
}