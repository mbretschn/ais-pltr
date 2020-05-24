
import { Ship, INmeaShipdata, INmeaPosition, NmeaPositionFeature } from 'ais-tools'
import { AbstractView } from '../lib'
import { ShipTabButtonView, PositionTabButtonView, CloseButtonView } from '../buttons'
import { ShipImageView } from './ShipImageView'

export class ShipDetailsView extends AbstractView {
    public name: string = 'ShipDetailsView'
    public selector: string = '.dialog.shipdata__details'
    private ship: Ship

    private format: string = 'HH:mm:ss'

    private shipdataFields: any[keyof INmeaShipdata] = [
        'MMSI', 'AIS',
        'Channel', 'AISversion',
        'IMOnumber', 'CallSign',
        'TimeStamp', 'PositionType',
        'Dimensions', 'Draught',
        'Destination', 'ETA',
        // 'CreatedAt', 'CreatedBy',
        // 'UpdatedAt', 'UpdatedBy',
        // '_id', 'Sender'
    ]

    private positionFields: any[keyof INmeaPosition] = [
        'MMSI', 'AIS',
        'Latitude', 'Longitude',
        'ROT', 'SOG',
        'COG','TrueHeading',
        'DistanceMoved',  'PositionAccuracy',
        'TimeStamp', 'TimeStampStatus',
        // 'CreatedAt', 'CreatedBy',
        // 'UpdatedAt', 'UpdatedBy',
        // '_id', 'Sender'
    ]

    constructor(ship: Ship) {
        super()
        this.ship = ship

        this.register('click', this.close)
        this.register('click', '.details-card', this.stop)
        this.register('click', '.details-card', this.stop)
        this.register('click', '.details-card', this.clipboard)

        this.subscribe('ship:details:data', this.shipdata)
        this.subscribe('ship:details:position', this.position)

        this.add('image', new ShipImageView(this.selector, this.ship))
        this.add('shipTab', new ShipTabButtonView(this.selector, this.ship))
        this.add('positionTab', new PositionTabButtonView(this.selector, this.ship))
        this.add('close', new CloseButtonView(this.selector, this))
    }

    public close = async (): Promise<void> => {
        await this.remove()
    }

    public stop = (ev: any): void => {
        ev.stopPropagation()
    }

    public show = async (): Promise<void> => {
        this.el.style.display = 'block'
        await this._show('zoomIn', this.element('.details-card'))
    }

    public hide = async (): Promise<void> => {
        await this._hide('zoomOut', this.element('.details-card'))
        this.el.style.display = 'none'
    }

    clipboard = (ev) => {
        const target = ev.target as HTMLElement
        const a = target.closest('[class*="shipdata-"]') as HTMLElement
        const b = target.closest('[class*="position-"]') as HTMLElement
        const c = a || b
        if (c) {
            const cont = (c.querySelector('.content') as HTMLElement).innerText
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

    shipdata = () => {
        this.element('.details-card__secondary.shipdata').style.display = 'block'
        this.element('.details-card__secondary.position').style.display = 'none'
        this.broadcast('ship:data:shown')
        this.broadcast('ship:position:hidden')
    }

    position = () => {
        this.element('.details-card__secondary.shipdata').style.display = 'none'
        this.element('.details-card__secondary.position').style.display = 'block'
        this.broadcast('ship:data:hidden')
        this.broadcast('ship:position:shown')
    }

    animate = (model: INmeaPosition | INmeaShipdata): void => {
        let fields, selectors
        if (model instanceof Ship) {
            fields = this.shipdataFields
            fields.push('Name')
            fields.push('ShipType')
            selectors = fields.map(field => `.shipdata-${field} .content`)
        }

        if (model instanceof NmeaPositionFeature) {
            fields = this.positionFields
            fields.push('NavigationStatus')
            selectors = fields.map(field => `.position-${field} .content`)
        }

        for (let i = 0; i < fields.length; i++) {
            const field = fields[i];
            const e = this.el.querySelector(selectors[i])
            const p = e.parentElement
            if (p) {
                let s: string = ''

                if ('TimeStamp,CreatedAt'.indexOf(field) >= 0) {
                    s = model.format(field, this.format)
                } else {
                    s = model.format(field)
                }

                if (e.innerText !== s) {
                    e.innerText = s
                    p.classList.add('animated', 'flash')
                    p.addEventListener('animationend', () => p.classList.remove('animated', 'flash'), { once: true })
                }
            }
        }
    }

    content = async (): Promise<void> => {
        this.el.prepend(await this.dialog())
    }

    private async dialog(): Promise<DocumentFragment> {
        let html: string[] = []

        html.push(`<div class="mdc-card details-card mdc-elevation--z16 unselectable">`)
        html.push(`<div class="details-card__wrapper">`)
        html.push(this.get('image').preRender())
        html.push(`<div class="details-card__primary">`)
        html.push(`<h2 class="details-card__title mdc-typography mdc-typography--headline6 shipdata-Name"><span class="content">${this.ship.format('Name')}</span></h2>`)
        html.push(`<h3 class="details-card__subtitle mdc-typography mdc-typography--subtitle2 shipdata-ShipType""><span class="content">${this.ship.format('ShipType')}</span></h3>`)
        html.push(`<h3 class="details-card__subtitle mdc-typography mdc-typography--subtitle2 position-NavigationStatus"><span class="content">${this.ship.position.format('NavigationStatus')}</span></h3>`)
        html.push(`</div>`)
        html.push(`</div>`)
        html.push(`<div class="details-card__secondary shipdata mdc-typography mdc-typography--body2 unselectable">`)

        for (const field of this.shipdataFields) {
            if ('TimeStamp,CreatedAt'.indexOf(field) >= 0) {
                html.push(`<p class="shipdata-${field}"><span class="label">${field}</span> <span class="content">${this.ship.format(field, this.format)}</span></p>`)
            } else if (field === 'ETA') {
                html.push(`<p class="shipdata-${field}"><span class="label">${field}</span> <span class="content">${this.ship.format(field, 'MM-DD-YYYY')}</span></p>`)
            } else {
                html.push(`<p class="shipdata-${field}"><span class="label">${field}</span> <span class="content">${this.ship.format(field)}</span></p>`)
            }
        }

        html.push(`</div>`)
        html.push(`<div class="details-card__secondary position mdc-typography mdc-typography--body2 unselectable" style="display: none;">`)

        for (const field of this.positionFields) {
            if ('TimeStamp,CreatedAt'.indexOf(field) >= 0) {
                html.push(`<p class="position-${field}"><span class="label">${field}</span> <span class="content">${this.ship.position.format(field, 'HH:mm:ss')}</span></p>`)
            } else {
                html.push(`<p class="position-${field}"><span class="label">${field}</span> <span class="content">${this.ship.position.format(field)}</span></p>`)
            }
        }

        html.push(`</div>`)
        html.push(`<div class="mdc-card__actions">`)
        html.push(`<div class="mdc-card__action-buttons">`)
        html.push(this.get('shipTab').preRender())
        html.push(this.get('positionTab').preRender())
        html.push(`</div>`)
        html.push(`<div class="mdc-card__action-icons">`)
        html.push(this.get('close').preRender())
        html.push(`</div>`)
        html.push(`</div>`)
        html.push(`</div>`)

        return this.toDocumentFragment(html)
    }

    public detachEvents(): boolean {
        this.ship.off('ship', this.animate)
        this.ship.off('position', this.animate)
        this.ship.unsubscribe()

        return super.detachEvents()
    }

    public attachEvents(): boolean {
        this.ship.on('ship', this.animate)
        this.ship.on('position', this.animate)
        this.ship.subscribe()

        return super.attachEvents()
    }
}
