import { ShipCollection } from 'ais-tools'
import { Database, MessageLogger } from './lib'
import { PageView, DrawerView, HeaderView, MapView, ShipDetailsView, PositionTableView, ShipTableView, HelpView } from './views'
import { ShipLayer, PopupCollectionLayer, TrackCollectionLayer } from './layer'
import { default as Swal } from 'sweetalert2/src/sweetalert2.js'

export class Controller {
    private logger: MessageLogger
    private database: Database

    private ships: ShipCollection
    private pageView: PageView
    private drawerView: DrawerView
    private headerView: HeaderView
    private mapView: MapView
    private shipLayer: ShipLayer
    private popupCollectionLayer: PopupCollectionLayer
    private shipDetailsView?: ShipDetailsView
    private trackCollectionLayer: TrackCollectionLayer
    private positionTableView?: PositionTableView
    private shipTableView: ShipTableView
    private helpView?: HelpView

    private trackHistory: boolean = true
    private helpShown: boolean = false

    constructor() {
        this.logger = new MessageLogger()

        this.database = new Database({
            "host": "/api",
            "dbName": "ais_tracker",
            "sender": "socket"
        })

        this.ships = new ShipCollection(this.database, this.logger)

        this.pageView = new PageView()
        this.drawerView = new DrawerView()
        this.headerView = new HeaderView()
        this.mapView = new MapView()
        this.shipLayer = new ShipLayer(this.ships, this.mapView)
        this.popupCollectionLayer = new PopupCollectionLayer(this.ships, this.mapView)
        this.trackCollectionLayer = new TrackCollectionLayer(this.mapView)
        this.shipTableView = new ShipTableView(this.ships)

        document.addEventListener('ship:detail', this.showShipDetail, false)
        document.addEventListener('ship:positions', this.showPositionTable, false)
        document.addEventListener('request:track', this.responseTrack, false)
        document.addEventListener('request:track:mmsi', this.responseTrackMMSI, false)
        document.addEventListener('request:lock:mmsi', this.responseLockkMMSI, false)
        document.addEventListener('request:unlock:mmsi', this.responseUnlockkMMSI, false)
        document.addEventListener('request:locked:mmsi', this.responseLockedMMSI, false)
        document.addEventListener('request:toggle:history', this.responseToggleHistory, false)
        document.addEventListener('request:load:history', this.responseLoadHistory, false)

        document.addEventListener('request:help:shown', this.responseHelpShown, false)
        document.addEventListener('request:show:help', this.responseShowHelp, false)

        document.addEventListener('visibilitychange', this.handleVisibilityChange, false)

        document.addEventListener('view:shown', this.helpShow)
        document.addEventListener('view:hidden', this.helpHide)

        this.run()
    }

    private helpShow = (ev: any): void => {
        if (ev.detail.name === 'HelpView') {
            this.helpShown = true
            this.responseHelpShown()
        }
    }

    private helpHide = (ev: any): void => {
        if (ev.detail.name === 'HelpView') {
            this.helpShown = false
            this.responseHelpShown()
        }
    }

    private responseHelpShown = (): void => {
        document.dispatchEvent(new CustomEvent('response:help:shown', { detail: this.helpShown }))
    }

    private responseShowHelp = async (ev: any): Promise<void> => {
        this.helpShown = true

        this.helpView = new HelpView()
        await this.helpView.render()

        this.responseHelpShown()
    }

    private responseToggleHistory = (ev: any): void => {
        this.trackHistory = !this.trackHistory
        document.dispatchEvent(new CustomEvent('response:load:history', { detail: this.trackHistory }))
    }

    private responseLoadHistory = (ev: any): void => {
        document.dispatchEvent(new CustomEvent('response:load:history', { detail: this.trackHistory }))
    }

    private responseLockedMMSI = (ev: any): void => {
        document.dispatchEvent(new CustomEvent('response:locked:mmsi', { detail: this.shipLayer.lockedMMSI() }))
    }

    private responseLockkMMSI = async (ev: any): Promise<void> => {
        const MMSI = ev.detail.MMSI
        if (MMSI) {
            this.shipLayer.lockMMSI(MMSI)
            document.dispatchEvent(new CustomEvent(`response:locked:mmsi`, { detail: this.shipLayer.lockedMMSI() }))
        }
    }

    private responseUnlockkMMSI = async (ev: any): Promise<void> => {
        this.shipLayer.unlockMMSI()
        document.dispatchEvent(new CustomEvent(`response:locked:mmsi`, { detail: this.shipLayer.lockedMMSI() }))
    }

    private showPositionTable = async (ev: any): Promise<void> => {
        if (this.positionTableView) {
            await this.positionTableView.remove()
        }
        this.positionTableView = new PositionTableView(ev.detail.ship)
        await this.positionTableView.render()
    }

    private showShipDetail = async (ev: any): Promise<void> => {
        if (this.shipDetailsView) {
            await this.shipDetailsView.remove()
        }
        this.shipDetailsView = new ShipDetailsView(ev.detail.ship)
        await this.shipDetailsView.render()
    }

    private responseTrack = async (ev: any): Promise<void> => {
        document.dispatchEvent(new CustomEvent('response:track', { detail: !this.trackCollectionLayer.isEmpty() }))
    }

    private responseTrackMMSI = async (ev: any): Promise<void> => {
        const MMSI = ev.detail.MMSI
        document.dispatchEvent(new CustomEvent(`response:track:${MMSI}`, { detail: this.trackCollectionLayer.hasTrackMMSI(MMSI) }))
    }

    public async finalize(): Promise<void> {
        await this.ships.unsubscribe()

        await this.database.disconnect()

        this.shipTableView.close()
        this.positionTableView && this.positionTableView.close()
        this.shipDetailsView && this.shipDetailsView.remove()

        await this.shipLayer.remove()
        await this.popupCollectionLayer.remove()
        await this.trackCollectionLayer.remove()

        // console.log('removed')
    }

    public async initialize(): Promise<void> {
        document.dispatchEvent(new CustomEvent('set:waitstate'))

        await this.database.connect()

        await this.ships.fetchInterval(10, 'minutes')
        await this.ships.subscribe()

        await this.shipLayer.render()
        await this.shipTableView.render()
        await this.popupCollectionLayer.render()
        await this.trackCollectionLayer.render()

        document.dispatchEvent(new CustomEvent('unset:waitstate'))

        // console.log('rendered')
    }
    
    private handleVisibilityChange = async (ev: any): Promise<void> => {
        if (document['hidden']) {
            this.finalize()
        } else {
            this.initialize()
        }
    }

    public async run(): Promise<void> {
        await this.pageView.render()
        await this.drawerView.render()
        await this.headerView.render()
        await this.mapView.render()

        try {
            await this.initialize()
        } catch (ex) {
            document.dispatchEvent(new CustomEvent('unset:waitstate'))

            Swal.fire({
                icon: 'error',
                title: 'Server is not responding',
                text: 'The AIS Plotter API Server is not resonding.',
                confirmButtonText: 'Retry',
                onClose: () => {
                    window.location.reload()
                }
            })
        }
    }
}