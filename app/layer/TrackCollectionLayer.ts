import { MDCDialog } from '@material/dialog';
import { ColorSchemes, Color, Ship } from 'ais-tools'
import { AbstractLayer } from '../lib/index'
import { TrackLayer } from './TrackLayer'
import { MapView } from '../views'

export class TrackCollectionLayer extends AbstractLayer {
    public name: string = 'TrackLayerCollectionView'
    public selector: string = '.mdc-dialog'

    private collection: any[] = []
    private map: MapView
    private dialog?: MDCDialog

    constructor(mapView: MapView) {
        super()

        this.map = mapView

        for (const color of ColorSchemes) {
            this.collection.push({
                color,
                layer: undefined
            })
        }
    }

    public isEmpty = () => {
        return !this.collection.some(item => item.layer !== undefined)
    }

    public hasTrackMMSI = (MMSI: number) => {
        return this.collection.findIndex(item => item.layer && item.layer.ship.MMSI === MMSI) > -1
    }

    public addToMap = async (ev: any): Promise<void> => {
        const ship = ev.detail.ship
        const MMSI = ship.MMSI

        if (this.collection.findIndex(item => item.layer && item.layer.ship.MMSI === MMSI) > -1) {
            this.removeFromMap(MMSI)
        } else {
            const slot = this.collection.find(item => item.layer === undefined)
            if (slot) {
                slot.layer = new TrackLayer(ship, this.map)
                await slot.layer.render(slot.color)
                this.broadcast('ship:track', { action: 'add', ship: ship })
            } else {
                this.open(true)
            }
        }
    }

    public removeFromMap(ship: Ship | number) {
        const MMSI = (typeof(ship) === 'number') ? ship : ship.MMSI

        const slot = this.collection.find(item => item.layer && item.layer.ship.MMSI === MMSI)
        if (slot) {
            const ship = slot.layer.ship
            slot.layer.remove()
            slot.layer = undefined
            this.broadcast('ship:track', { action: 'removed', ship: ship })
        }
    }

    public async remove(): Promise<void> {
        this.dialog && this.dialog.close()

        for (const slot of this.collection) {
            if (slot.layer) {
                this.removeFromMap(slot.layer.ship.MMSI)
            }
        }
        super.remove()
    }

    private listTitle = (isExceed: boolean = false) => {
        let title = isExceed ? 'Current Tracks displayed on Map' : 'Maximum number of tracks has been exceeded'

        return this.toDocumentFragment(`<h2 class="mdc-dialog__title">${title}</h2>`)
    }

    private listSubtitle = (isExceed: boolean = false) => {
        let subtitle = isExceed ? 'Select a Track for removal' : 'Remove a track continue.'

        return this.toDocumentFragment(`<p class="mdc-typography--body1">${subtitle}</p>`)
    }

    private listitemShip = (ship: Ship, color: Color): DocumentFragment => {
        const html = `<li class="mdc-list-item" tabindex="0" style="background-color: ${color.get(0, 0.4)};">
            <div class="mdc-form-field">
                <div class="mdc-checkbox">
                    <input type="checkbox" class="mdc-checkbox__native-control" data-mmsi="${ship.MMSI}"/>
                    <div class="mdc-checkbox__background">
                        <svg class="mdc-checkbox__checkmark" viewBox="0 0 24 24">
                            <path class="mdc-checkbox__checkmark-path" fill="none"
                                d="M1.73,12.91 8.1,19.28 22.79,4.59" />
                        </svg>
                        <div class="mdc-checkbox__mixedmark"></div>
                    </div>
                    <div class="mdc-checkbox__ripple"></div>
                </div>
            </div>
            <span class="mdc-list-item__text unselectable">
                <span class="mdc-list-item__primary-text">${ship.Name}</span>
                <span class="mdc-list-item__secondary-text">${ship.MMSI}</span>
            </span>
        </li>`

        return this.toDocumentFragment(html)
    }

    private listitemEmpty = (color: Color): DocumentFragment => {
        const html = `<li class="mdc-list-item is-empty" tabindex="0" style="background-color: ${color.get(0, 0.4)};">
            <div class="mdc-form-field">
                <div class="mdc-checkbox">
                    <input type="checkbox" class="mdc-checkbox__native-control" disabled="disabled" />
                    <div class="mdc-checkbox__background">
                        <svg class="mdc-checkbox__checkmark" viewBox="0 0 24 24">
                            <path class="mdc-checkbox__checkmark-path" fill="none"
                                d="M1.73,12.91 8.1,19.28 22.79,4.59" />
                        </svg>
                        <div class="mdc-checkbox__mixedmark"></div>
                    </div>
                    <div class="mdc-checkbox__ripple"></div>
                </div>
            </div>
            <span class="mdc-list-item__text unselectable">
                <span class="mdc-list-item__primary-text">Empty</span>
                <span class="mdc-list-item__secondary-text">Not yet set</span>
            </span>
        </li>`

        return this.toDocumentFragment(html)
    }

    private open = (isExceed: boolean = false): void => {
        this.element('.mdc-dialog__title').replaceWith(this.listTitle(isExceed))
        this.element('.mdc-typography--body1').replaceWith(this.listSubtitle(isExceed))

        for (let item of this.collection) {
            if (typeof(item.layer) !== 'undefined') {
                this.element('.mdc-list').append(this.listitemShip(item.layer.ship, item.color))
            } else {
                this.element('.mdc-list').append(this.listitemEmpty(item.color))
            }
        }
        this.dialog && this.dialog.open()
    }

    public close = async (): Promise<void> => {
        this.element('.mdc-list').innerHTML = ''
    }

    private selected = (ev: any) => {
        if (!ev.target.classList.contains('mdc-checkbox__native-control')) {
            const li = ev.target.closest('li:not([class~="is-empty"])') as HTMLElement
            if (li) {
                const input = li.querySelector('input[type="checkbox"]') as HTMLInputElement
                input.checked = !input.checked
            }
        }
    }

    private accept = () => {
        const checked = document.querySelectorAll('input:checked')
        for (const item of checked) {
            this.removeFromMap(Number((item as HTMLInputElement).dataset.mmsi))
        }
        this.dialog && this.dialog.close()
    }

    public attachEvents(): boolean {
        this.dialog && this.dialog.listen('MDCDialog:closing', this.close)

        return super.attachEvents()
    }

    public detachEvents(): boolean {
        this.dialog && this.dialog.unlisten('MDCDialog:closing', this.close)

        return super.detachEvents()
    }

    public async content(): Promise<void> {
        this.el.innerHTML = ''
        this.el.prepend(this.body())

        this.subscribe('track:collection:panel', this.open)
        this.subscribe('ship:track:add', this.addToMap)

        this.register('click', '.mdc-list', this.selected)
        this.register('click', 'button.btn-accept', this.accept)
    }

    private body = (): DocumentFragment => {
        const html: string = `<div class="mdc-dialog__container">
            <div class="mdc-dialog__surface" role="alertdialog">
                <h2 class="mdc-dialog__title"></h2>
                <div class="mdc-dialog__content">
                    <p class="mdc-typography--body1"></p>
                    <ul class="mdc-list mdc-list--two-line"></ul>
                </div>
                <div class="mdc-dialog__actions">
                    <button type="button" class="mdc-button mdc-dialog__button" data-mdc-dialog-action="close">
                        <div class="mdc-button__ripple"></div>
                        <span class="mdc-button__label">Cancel</span>
                    </button>
                    <button type="button" class="mdc-button mdc-dialog__button btn-accept" data-mdc-dialog-action="accept">
                        <div class="mdc-button__ripple"></div>
                        <span class="mdc-button__label">Remove selected</span>
                    </button>
                </div>
            </div>
            </div>
            <div class="mdc-dialog__scrim"></div>`

        return this.toDocumentFragment(html)
    }

    public render = async (): Promise<void> => {
        await this.beforeRender()
        await this.content()

        this.dialog = new MDCDialog(this.el)

        await this.afterRender()
    }
}
