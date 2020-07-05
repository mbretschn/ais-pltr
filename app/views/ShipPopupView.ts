import { default as L, Popup } from 'leaflet'
import { Ship } from 'ais-tools'
import { AbstractLayer } from '../lib'
import { DetailsButtonView, TrackButtonView, PositionsButtonView } from '../buttons'
import { ShipImageView } from './ShipImageView'

export class ShipPopupView extends AbstractLayer {
    public name: string = 'ShipPopupView'
    public selector: string
    public ship: Ship
    private popup?: Popup

    constructor(ship: Ship) {
        super()

        this.ship = ship
        this.selector = `#popup-${this.ship._id}`

        this.register('click', '.popup-card__primary h2', this.clipboard)
        this.register('click', '.popup-card__primary h3', this.clipboard)

        this.add('image', new ShipImageView(this.selector, this.ship))
        this.add('details', new DetailsButtonView(this.selector, this.ship))
        this.add('track', new TrackButtonView(this.selector, this.ship))
        this.add('positions', new PositionsButtonView(this.selector, this.ship))
    }

    clipboard = (ev) => {
        const target = ev.target as HTMLElement
        if (target) {
            const cont = target.innerText
            const el = document.createElement('textarea')
            el.value = cont
            el.setAttribute('readonly', '')
            el.style.position = 'absolute'
            el.style.left = '-9999px'
            document.body.appendChild(el)
            el.select()
            document.execCommand('copy')
            document.body.removeChild(el)
        }
    }

    content = async (): Promise<DocumentFragment> => {
        let html: string[] = []

        html.push(this.get('image').preRender())
        html.push(`<div role="progressbar" class="mdc-linear-progress mdc-linear-progress--indeterminate" aria-valuemin="0"
            aria-valuemax="1" aria-valuenow="0">
            <div class="mdc-linear-progress__buffer"></div>
            <div class="mdc-linear-progress__bar mdc-linear-progress__primary-bar">
                <span class="mdc-linear-progress__bar-inner"></span>
            </div>
            <div class="mdc-linear-progress__bar mdc-linear-progress__secondary-bar">
                <span class="mdc-linear-progress__bar-inner"></span>
            </div>
        </div>`)
        html.push(`<div class="popup-card__primary">`)
        html.push(`<h2 class="popup-card__title mdc-typography mdc-typography--headline6 unselectable">${this.ship.format('Name')}</h2>`)
        html.push(`<h3 class="popup-card__subtitle mdc-typography mdc-typography--subtitle2 unselectable">${this.ship.format('ShipType')}</h3>`)
        html.push(`</div>`)
        html.push(`<div class="popup-card__secondary mdc-typography mdc-typography--body2 unselectable">${this.ship.position.format('Sender')}</div>`)
        html.push(`<div class="mdc-card__actions">`)
        html.push(`<div class="mdc-card__action-buttons">`)
        html.push(this.get('details').preRender())
        html.push(this.get('track').preRender())
        html.push(this.get('positions').preRender())
        html.push(`</div>`)
        html.push(`</div>`)

        return this.toDocumentFragment(html)
    }

    public async render(): Promise<L.Popup> {
        this.el = document.createElement('div')
        this.el.setAttribute('id', `popup-${this.ship._id}`)
        this.el.classList.add('mdc-card', 'popup-card')
        this.el.append(await this.content())

        this.popup = L.popup({
            autoPan: true,
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