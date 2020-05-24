import { default as L, Popup } from 'leaflet'
import { ILatLng } from 'ais-tools'
import { AbstractView } from '../lib'

export class MapView extends AbstractView {
    public name: string = 'map'
    public selector: string = '.map'
    private _map: any

    private options: any = {
        url: '/osm/{z}/{x}/{y}.png',
        attribution: 'AIS Plotter &copy; <a href="https://github.com/3epnm/ais-plotter">GitHub</a> | Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
        center: [ 53.52592139730874, 9.96837615966797 ],
        zoom: 13,
        maxZoom: 19,
        minZoom: 11
    }

    private BBoxString: string = window.location.hash.substr(1)
    private layers: any[] = []

    constructor(options?: any) {
        super()
        this.options = options || this.options

        this.subscribe('map:zoom:in', this.zoomIn)
        this.subscribe('map:zoom:out', this.zoomOut)
        this.subscribe('map:bbox', this.setBbox)
        this.subscribe('map:show:all:features', this.showAllFeatures)
        this.subscribe('position:selected', this.centerPosition)
    }

    public get map() {
        return this._map
    }

    public centerPosition = (ev: any): void => {
        const coord = ev.detail.position.Location.coordinates
        const latlng = L.latLng([ coord[1], coord[0] ])
        this._map.setView(latlng, 17)
    }

    public setView(location: ILatLng, options: any = {}): void {
        const latlng = L.latLng(location)
        this._map.setView(latlng, 17, options)
    }

    public setBounds = (): void => {
        this.broadcastMapState()

        var latLngBounds = this._map.getBounds()
        this.BBoxString = latLngBounds.toBBoxString()

        window.location.hash = this.BBoxString
    }

    public setBbox = (ev: any): void => {
        const bounds = ev.detail.bbox.split(',')
        this._map.fitBounds([[bounds[3], bounds[2]], [bounds[1], bounds[0]]])
    }

    public getBounds = (): void => {
        if (this.BBoxString) {
            const bounds = this.BBoxString.split(',')
            this._map.fitBounds([[bounds[3], bounds[2]], [bounds[1], bounds[0]]])
        }
    }

    public removeFromMap(type: string): void {
        const idx = this.layers.findIndex(layer => layer.type === type)
        if (idx > -1) {
            this._map.removeLayer(this.layers[idx].layer)
            this.layers.splice(idx, 1)
        }
    }

    public addToMap(type: string, layer: any): void {
        this.layers.push({ type, layer })
        this._map.addLayer(layer)
        this.broadcastMapState()
    }

    public openPopup(popup: Popup): void {
        this._map.openPopup(popup)
    }

    public closePopup(popup: Popup): void {
        this._map.closePopup(popup)
    }

    private broadcastMapState(): void {
        let allFeaturesShown: boolean = true
        if (this.layers[0] && this.layers[0].layer.getLayers().length > 0) {
            allFeaturesShown = this._map.getBounds().contains(this.layers[0].layer.getBounds())
        }

        const mapState = {
            level: this._map.getZoom(),
            canZoomIn: this._map.getZoom() < this._map.getMaxZoom(),
            canZoomOut: this._map.getZoom() > this._map.getMinZoom(),
            allFeaturesShown: allFeaturesShown
        }

        this.broadcast('map:zoom', mapState)
    }

    private zoomIn = () => {
        this._map.zoomIn()
        this.broadcastMapState()
    }

    private zoomOut = () => {
        this._map.zoomOut()
        this.broadcastMapState()
    }

    private showAllFeatures = () => {
        if (this.layers[0]) {
            this._map.fitBounds(this.layers[0].layer.getBounds())
        }
        this.broadcastMapState()
    }

    public mapClicked = (ev: any): void => {
        let contained = false

        for (const layer of this.layers) {
            if (contained) {
                break;
            }
            layer.layer.eachLayer(layer => {
                if (layer.getBounds && layer.getBounds().contains(ev.latlng)) {
                    contained = true
                }
            })
        }
        if (!contained) {
            this.broadcast(`${this.name}:clicked`)
        }
    }

    public attachEvents(): boolean {
        if (this._map) {
            this._map.on('click', this.mapClicked)
            this._map.on('zoomend', this.setBounds)
            this._map.on('moveend', this.setBounds)
        }

        return super.attachEvents()
    }

    public detachEvents(): boolean {
        if (this._map) {
            this._map.off('click', this.mapClicked)
            this._map.off('zoomend', this.setBounds)
            this._map.off('moveend', this.setBounds)
        }

        return super.detachEvents()
    }

    public async content(): Promise<void> {
        this._map = L.map(this.el, { zoomControl: false }).setView(this.options.center, this.options.zoom)

        L.tileLayer(this.options.url, {
            maxZoom: this.options.maxZoom,
            minZoom: this.options.minZoom,
            attribution: this.options.attribution
        }).addTo(this._map)

        this.getBounds()
    }
}