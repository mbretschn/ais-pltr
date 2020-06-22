import { ShipCollection, Ship, ILatLng, NmeaPositionFeature } from 'ais-tools'
import { AbstractLayer } from '../lib/index'
import { MapView, ShipPopupView, PositionPopupView } from '../views/index'

export class PopupCollectionLayer extends AbstractLayer {
    public name: string = 'ship'
    public selector: string = 'ships'

    private collection: ShipCollection
    private popups: any[] = []
    private map: MapView

    constructor(collection: ShipCollection, map: MapView) {
        super()
        this.collection = collection
        this.map = map
    }

    private getLocation(ship: Ship): ILatLng {
        const feature = ship.toShipFeature(ship.position)
        const geometry = feature[0].geometry as any
        const y = geometry.coordinates[0].map (x => x[0]);
        const x = geometry.coordinates[0].map (x => x[1]);
        const cx = (Math.min (...x) + Math.max (...x)) / 2;
        const cy = (Math.min (...y) + Math.max (...y)) / 2;
        return {
            lat: cx,
            lng: cy
        }
    }

    public addPositionPopup = async (ev: any): Promise<void> => {
        const position = ev.detail.position
        const popup = this.popups.find(popup => popup.popup.position && popup.popup.position._id === position._id)
        if (popup) {
            return this.removePopup(popup)
        } else {
            const popup = new PositionPopupView(position)

            const content = await popup.render()
            content.setLatLng({
                lat: position.Latitude,
                lng: position.Longitude
            })

            this.map.openPopup(content)

            this.popups.push({ popup, content })
        }
    }

    public addShipPopup = async (ev: any): Promise<void> => {
        const ship = ev.detail.ship
        const popup = this.popups.find(popup => popup.popup.ship && popup.popup.ship.MMSI === ship.MMSI)
        if (popup) {
            return this.removePopup(popup)
        } else {
            const popup = new ShipPopupView(ship)
            const content = await popup.render()
            content.setLatLng(this.getLocation(ship))
            this.map.openPopup(content)
            this.popups.push({ popup, content })
        }
    }

    public removePopup = (popup: any, updateCollection: boolean = true): void => {
        if (updateCollection) {
            if (popup.popup.ship) {
                const idx = this.popups.findIndex(item => item.popup.ship && item.popup.ship.MMSI === popup.popup.ship.MMSI)
                this.popups.splice(idx, 1)
            } else if (popup.popup.position) {
                const idx = this.popups.findIndex(item => item.popup.poition && item.popup.poition._id === popup.popup.position._id)
                this.popups.splice(idx, 1)
            }
        }

        this.map.closePopup(popup.content)
        popup.popup.remove()
    }

    public removePopups = (ev?: any): void => {
        for (const popup of this.popups) {
            this.removePopup(popup, false)
        }
        this.popups = []
    }

    public updatePopup = (popup: any, ship: Ship): void => {
        popup.content.setLatLng(this.getLocation(ship))
    }

    public updatePopups = async (data: Ship | NmeaPositionFeature): Promise<void> => {
        try {
            let ship: Ship
            if (data instanceof NmeaPositionFeature) {
                ship = await this.collection.findByMMSI(data.MMSI, { cache: true, force: false })
            } else {
                ship = data
            }
            const popup = this.popups.find(popup => popup.popup.ship && popup.popup.ship.MMSI === data.MMSI)
            if (popup) {
                this.updatePopup(popup, ship)
            }
        } catch (ex) { }
    }

    public attachEvents(): boolean {
        if (this.collection) {
            this.collection.on('ship', this.updatePopups)
            this.collection.on('position', this.updatePopups)
        }
        return super.attachEvents()
    }

    public detachEvents(): boolean {
        if (this.collection) {
            this.collection.off('ship', this.updatePopups)
            this.collection.off('position', this.updatePopups)
        }
        return super.detachEvents()
    }

    public async remove(): Promise<void> {
        this.removePopups()
        super.remove()
    }

    public async content(): Promise<void> {
        this.subscribe('ship:clicked', this.addShipPopup)
        this.subscribe('track:clicked', this.addPositionPopup)
        this.subscribe('map:clicked', this.removePopups)
    }
}
