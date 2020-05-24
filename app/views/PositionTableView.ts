import { default as Queue } from 'better-queue'
import { default as MemoryStore } from 'better-queue-memory'
import { Ship, INmeaPositionDB, INmeaPosition } from 'ais-tools'
import { AbstractView } from '../lib'
import { CloseIconButtonView, LockButtonView, LockIconButtonView } from '../buttons'

export class PositionTableView extends AbstractView {
    public name: string = 'PositionTableView'
    public selector: string = '.positions.data-table-container'
    public ship: Ship

    private q: any
    private format: string = 'HH:mm:ss'
    private idx: number = 0
    private interrupt: boolean = false
    private timeoutID: any = undefined
    private last: INmeaPosition[] = []

    private _fields: any[keyof INmeaPositionDB] = [
        'NavigationStatus', 'DistanceMoved', 'TimeStamp', 'Latitude', 'Longitude', 'TrueHeading',  'CreatedBy', 'UpdatedBy', 'CreatedAt', 'UpdatedAt'
        //, 'MMSI', 'ROT', 'SOG', 'COG', 'PositionAccuracy', 'TimeStampStatus', 'TimeStampReceived', 'DerivedSpeed', 'Revision', 'AIS', 'Channel', '_id'
    ]

    public show = async (): Promise<void> => {
        return this._show('fadeInUp')
    }

    public hide = async (): Promise<void> => {
        return this._hide('fadeOutDown')
    }

    constructor(ship: Ship) {
        super()
        this.ship = ship
        this.last = []

        this.register('click', 'tbody.tail', this.selected)
        this.register('scroll', '.data-table', this.scroll)

        this.add('lock', new LockButtonView(this.selector, this.ship))
        this.add('lockicon', new LockIconButtonView(this.selector, this.ship))
        this.add('close', new CloseIconButtonView(this.selector, this))
    }

    public close = async (): Promise<void> => {
        await this.remove()
    }

    private queueCB = (item, cb): void => {
        try {
            this.element(`tr[data-row-id="${item._id}"]`, true)
            return cb(null)
        } catch (ex) { }

        if (this.last.length > 0 && this.last.some(position => position.compare(item))) {
            cb(null)
        } else {
            this.last.push(item)
            if (this.last.length > 10) {
                this.last.shift()
            }
            const table = this.element('.data-table')
            const head = this.element('.data-table .mdc-data-table__content.head')
            const tail = this.element('.data-table .mdc-data-table__content.tail')

            table.classList.add('tstart')
            try {
                head.append(this.row(item))
                head.addEventListener('transitionend', () => {
                    table.classList.remove('tanimated')
                    table.classList.remove('tstart')
                    table.classList.remove('trun')

                    const el = this.element('.data-table .mdc-data-table__content.head tr', true)
                    tail.prepend(el)

                    if (tail.children.length > 100) {
                        const el = this.element('.data-table .mdc-data-table__content.tail tr:last-child', true)
                        el.remove()
                    }

                    setTimeout(() => {
                        cb(null)
                    }, 750)
                }, { once: true })

                setTimeout(() => {
                    table.classList.add('tanimated')
                    setTimeout(() => {
                        table.classList.add('trun')
                    }, 10)
                }, 10)
            } catch (ex) {
                table.classList.add('tstart')
                console.log('queue', ex.message)
            }
        }
    }

    public scroll = (ev: any): void => {
        if (!this.q) {
            return
        }

        const table = this.element('.data-table') as HTMLTableElement

        if (!this.interrupt) {
            this.interrupt = true
            this.q.pause()
        }

        if (this.timeoutID) {
            clearTimeout(this.timeoutID)
        }

        this.timeoutID = setTimeout(() => {
            this.interrupt = false
            table.scrollTop = 0
            this.q.resume()
        }, 5000)
    }

    public queue = (position: INmeaPosition): void => {
        this.q.push(position)
    }

    public selected = async (ev: any): Promise<void> => {
        const positions = this.ship.positions
        const target = ev.target as HTMLElement
        const tr = target.closest('tr[data-row-id]') as HTMLElement

        if (tr && tr.dataset.rowId) {
            const position = await positions.find({ _id: tr.dataset.rowId })
            if (position) {
                this.broadcast('position:selected', { position: position })
            }
        }
    }

    public content = async (): Promise<void> => {
        this.el.prepend(await this.table())
    }

    public async table(): Promise<DocumentFragment> {
        const html: string[] = []
        html.push(`<header class="mdc-top-app-bar">`)
        html.push(`<div class="mdc-top-app-bar__row">`)
        html.push(`<section class="mdc-top-app-bar__section mdc-top-app-bar__section--align-start">`)
        html.push(`<span class="mdc-top-app-bar__title">${this.ship.format('Name')}</span>`)
        html.push(`</section>`)
        html.push(`<section class="mdc-top-app-bar__section mdc-top-app-bar__section--align-end" role="toolbar">`)
        html.push(this.get('lock').preRender('Lock', 'Unlock', 'mdc-button mdc-button--unelevated mdc-top-app-bar__action-item--unbounded'))
        html.push(this.get('lockicon').preRender('Lock', 'Unlock'))
        html.push(this.get('close').preRender())
        html.push(`</section>`)
        html.push(`</div>`)
        html.push(`</header>`)
        html.push(`<div class="mdc-data-table data-table">`)
        html.push(`<table class="mdc-data-table__table" aria-label="Nmea Positions">`)
        html.push(`<thead>`)
        html.push(`<tr class="mdc-data-table__header-row unselectable">`)
        html.push(`<th class="mdc-data-table__header-cell position-Ind">#</th>`)
        for (const field of this._fields) {
            html.push(`<th class="mdc-data-table__header-cell position-${field}" role="columnheader" scope="col">${field}</th>`)
        }
        html.push(`</tr>`)
        html.push(`</thead>`)
        html.push(`<tbody class="mdc-data-table__content head"></tbody>`)
        html.push(`<tbody class="mdc-data-table__content tail"></tbody>`)
        html.push(`</table>`)
        html.push(`</div>`)

        return this.toDocumentFragment(html)
    }

    private row(position: INmeaPosition): DocumentFragment {
        this.idx++
        const html: string[] = []
        html.push(`<tr data-row-id="${position._id}" class="mdc-data-table__row positions-data-row">`)
        html.push(`<td class="mdc-data-table__cell shipdata-Ind">${this.idx}</td>`)
        for (const field of this._fields) {
            if ('TimeStamp,CreatedAt,UpdatedAt'.indexOf(field) >= 0) {
                html.push(`<td class="mdc-data-table__cell position-${field}">${position.format(field, this.format)}</td>`)
            } else {
                html.push(`<td class="mdc-data-table__cell position-${field}">${position.format(field)}</td>`)
            }
        }
        html.push(`</tr>`)

        return this.toDocumentFragment(html)
    }

    public attachEvents(): boolean {
        this.q = new Queue(this.queueCB, { store: new MemoryStore() })
        this.ship.on('position', this.queue)

        return super.attachEvents()
    }

    public detachEvents(): boolean {
        this.q && this.q.destroy()
        this.ship.off('position', this.queue)

        return super.detachEvents()
    }

    public render = async (): Promise<void> => {
        await this.beforeRender()
        await this.content()
        await this.afterRender()

        await this.ship.fetchInterval(1, 'hour')
        await this.ship.subscribe()

        const body = this.element('tbody.tail')
        const positions = this.ship.positions.collection

        for (let i = positions.length - 1; i >= 0; i--) {
            try {
                body.prepend(this.row(positions[i]))
            } catch (ex) {
                console.log('init', ex.message)
            }
        }
    }

    public async remove(): Promise<void> {
        this.ship.unsubscribe()
        await super.remove()
        this.el.innerHTML = ''
    }
}
