import { default as L } from 'leaflet'
import { FeatureCollection } from 'geojson'
import { Color, Ship, NmeaPositionFeature } from 'ais-tools'
import { AbstractLayer } from '../lib/index'
import { MapView } from '../views'

export class TrackLayer extends AbstractLayer {
    public name: string = 'track'
    public selector: string

    public ship: Ship
    private map: MapView
    private layer?: any

    constructor(ship: Ship, map: MapView) {
        super()
        this.ship = ship
        this.map = map
        this.selector = `tracks-${this.ship.MMSI}`
    }

    private title = async (_id: string): Promise<string> => {
        const position = this.ship.positions.collection.find(position => position._id === _id)
        if (!position) {
            return 'Position not found'
        }

        if (position.CreatedBy !== position.UpdatedBy) {
            return `${position.format('DistanceMoved')}, ${position.format('Channel')}, ${position.format('TimeStamp', 'HH:mm:ss')}<br>${position.format('CreatedBy')}, ${position.format('UpdatedBy')}`
        }
        return `${position.format('DistanceMoved')}, ${position.format('Channel')}, ${position.format('TimeStamp', 'HH:mm:ss')}<br>${position.format('CreatedBy')}`
    }

    private onEachFeature = async (feature: any, layer: any): Promise<void> => {
        if (feature && feature.properties && feature.properties.mmsi) {
            layer.bindTooltip(await this.title(feature.properties._id), { permanent: false })
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

    public addFragment = async (position: NmeaPositionFeature) => {
        const features = await this.ship.toTrackFragment(position)
        this.layer.addData(features)
    }

    public attachEvents(): boolean {
        this.ship.on('position', this.addFragment)
        return super.attachEvents()
    }

    public detachEvents(): boolean {
        this.ship.off('position', this.addFragment)
        this.ship.unsubscribe()
        return super.detachEvents()
    }

    public async remove(): Promise<void> {
        try {
            this.layer.remove()
            this.map.removeFromMap(this.selector)
            super.remove()
        } catch (ex) { }
    }

    public async content(color: Color): Promise<void> {
        this.ship.color = color

        this.broadcast('set:waitstate')

        await new Promise (async (resolve) => {
            const onLoadHistory = async (ev: any) => {
                if (ev.detail === true) {
                    await this.ship.fetchInterval(1, 'hour')
                }
                document.removeEventListener('response:load:history', onLoadHistory, false)
                resolve()
            }
            document.addEventListener('response:load:history', onLoadHistory, false)
            this.broadcast('request:load:history')
        })

        await this.ship.subscribe()

        const featureCollection: FeatureCollection = {
            'type': 'FeatureCollection',
            'features': await this.ship.toTrack()
        }

        this.layer = L.geoJSON(featureCollection, {
            onEachFeature: this.onEachFeature,
            pane: 'tracks',
            style: <(feature: any) => any>this.style
        })

        this.map.addToMap(this.selector, this.layer)

        this.broadcast('ship:update', { ship: this.ship })

        this.broadcast('unset:waitstate')
    }
}