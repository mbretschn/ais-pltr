import { default as L } from 'leaflet'
import { ShipCollection, Ship, NmeaPositionFeature } from 'ais-tools'
import { AbstractLayer } from '../lib/index'
import { MapView } from '../views/index'

export class ShipLayer extends AbstractLayer {
    public name: string = 'ship'
    public selector: string = 'ships'

    private collection: ShipCollection
    private map: MapView
    private layer?: any
    private _selected: any[] = []
    private _lockedMMSI?: number

    constructor(collection: ShipCollection, map: MapView) {
        super()
        this.collection = collection
        this.map = map
    }

    private pointToLayer = (feature, latlng) => {
        return L.circleMarker(latlng, {
            radius: 4,
            opacity: 1,
            fillOpacity: 0.8
        })
    }

    public lockedMMSI = (): number | undefined => {
        return this._lockedMMSI
    }

    public lockMMSI = (MMSI: number): void => {
        this._lockedMMSI = MMSI
    }

    public unlockMMSI = (): void => {
        this._lockedMMSI = undefined
    }

    private title = (ship: Ship): string => {
        if (ship) {
            return ship.format('Name')
        }
        throw new Error('Ship not found')
    }

    private onEachFeature = async (feature: any, layer: any): Promise<void> => {
        if (feature && feature.properties && feature.properties.mmsi) {
            const MMSI = feature.properties.mmsi
            const ship = await this.collection.findByMMSI(MMSI, { cache: true, force: false })
            if (ship) {
                layer.bindTooltip(this.title(ship), { permanent: false })
            }
        }
    }

    private style = (feature: any): any => {
        if (feature) {
            return {
                stroke: feature.properties.stroke && true || false,
                color: feature.properties.stroke,
                weight: feature.properties['stroke-width'],
                opacity: feature.properties['stroke-opacity'],
                fill: feature.properties.fill && true || false,
                fillColor: feature.properties.fill,
                fillOpacity: feature.properties['fill-opacity']
            }
        }
    }

    private update = async (data: any): Promise<void> => {
        let mmsi, ship
        
        try {
            if (data instanceof Ship || data instanceof NmeaPositionFeature) {
                mmsi = data.MMSI
                ship = await this.collection.findByMMSI(mmsi, { cache: true, force: false })
            } else if (data.detail && data.detail.ship) {
                mmsi = data.detail.ship.MMSI
                ship = data.detail.ship
            }

            this.layer.eachLayer(layer => {
                if (layer.feature.properties.mmsi === mmsi) {
                    this.layer.removeLayer(layer)
                }
            })

            this.layer.addData(ship.toFeature())

            if (this._lockedMMSI == mmsi) {
                this.broadcast('position:selected', { position: ship.position})
            }
        } catch (ex) { }
    }

    private unselect = (): void => {
        for (const layer of this._selected) {
            layer.setStyle({
                color: layer.feature.properties.stroke,
                fillColor: layer.feature.properties.fill
            })
        }
        this._selected = []
    }

    private selected = (ev: any): void => {
        this.unselect()
        const mmsi = ev.detail.ship.MMSI
        this.layer.eachLayer(layer => {
            if (layer.feature.properties.type === 'Ship' && layer.feature.properties.mmsi === mmsi) {
                layer.setStyle({
                    color: 'red',
                    fillColor: 'orange'
                })
                this._selected.push(layer)
            }
        })
    }

    public layerClicked = async (ev: any): Promise<void> => {
        const MMSI = ev.layer.feature.properties.mmsi
        if (MMSI) {
            const ship = await this.collection.findByMMSI(MMSI, { cache: true })
            this.broadcast(`${this.name}:clicked`, { ship })
        }
    }

    public attachEvents(): boolean {
        this.collection.on('ship', this.update)
        this.collection.on('position', this.update)

        if (this.layer) {
            this.layer.on('click', this.layerClicked)
        }

        return super.attachEvents()
    }

    public detachEvents(): boolean {
        this.collection.off('ship', this.update)
        this.collection.off('position', this.update)

        if (this.layer) {
            this.layer.off('click', this.layerClicked)
        }

        return super.detachEvents()
    }

    public async remove(): Promise<void> {
        this.map.removeFromMap(this.selector)
        super.remove()
    }

    public async content(): Promise<void> {
        const featureCollection = await this.collection.toFeatureCollection()

        this.layer = L.geoJSON(featureCollection, {
            pointToLayer: this.pointToLayer,
            onEachFeature: this.onEachFeature,
            style: <(feature: any) => any>this.style
        })

        this.map.addToMap(this.selector, this.layer)

        this.subscribe('map:clicked', this.unselect)
        this.subscribe('ship:selected', this.selected)
        this.subscribe('ship:update', this.update)
    }
}
